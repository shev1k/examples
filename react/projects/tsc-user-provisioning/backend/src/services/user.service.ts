import bcrypt from 'bcrypt';
import { WhereOptions, Op } from 'sequelize';

import { IPagination, IPaginationQueryParams } from '@/interfaces/pagination';
import { UserTokenService } from '@/services';
import { IUserDto, IUserCreationDto } from '@/dtos/user.dto';
import { getPagination } from '@/utils';
import { SALT_ROUNDS } from '@/configs/crypt.config';
import { AccountType, AccountStatus, SupportRole, UserRole } from '@/enums';
import { User } from '@/models';

interface ICommonFilters<Role> extends IPaginationQueryParams {
  account_status: AccountStatus;
  role?: Role;
  firstname?: string;
  lastname?: string;
  email?: string;
}

interface IUsersFilters extends ICommonFilters<UserRole> {
  cafe_number?: string[];
}

interface ISupportFilters extends ICommonFilters<SupportRole> {}

class UserService {
  private tokenService: UserTokenService;

  constructor() {
    this.tokenService = new UserTokenService();
  }

  public getUserByToken = async (token: string) => {
    const t = token.split(' ')[1] || token;
    const { uuid } = this.tokenService.decodeToken(t);

    return await this.getUserById(uuid);
  };

  public async getUserById(uuid: string) {
    const user = await User.findOne({
      where: {
        uuid,
      },
    });

    return user?.get();
  }

  public getUserByEmail = async (email: string) => {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    return user?.get();
  };

  public getUsers = async (
    account_type: AccountType,
    filters: (IUsersFilters | ISupportFilters) & { field?: string; order?: string },
    pagination?: IPagination,
  ): Promise<{
    data: IUserDto[];
    totalPages?: number;
    totalItems?: number;
    currentPage?: number;
  }> => {
    const query = this.getUsersCommonFilterQuery(filters);
    const attributes = ['uuid', 'role', 'firstname', 'lastname', 'email', 'cafe_number'];
    let sort;

    if (filters.field) {
      sort = filters.order ? [[filters.field, filters.order.toUpperCase()]] : undefined;
    }

    if (account_type === AccountType.user) {
      query.role = {
        [Op.in]: Object.values(UserRole),
      };

      if (filters.role in UserRole) {
        query.role = filters.role;
      }

      if ('cafe_number' in filters) {
        query.cafe_number = {
          [Op.regexp]: filters.cafe_number
            .map((cafe) => `((?:^|\W)${cafe}(?:^|\W|$))`)
            .join('|'),
        };
      }
    }

    if (account_type === AccountType.support) {
      query.role = {
        [Op.in]: Object.values(SupportRole),
      };

      if (filters.role in SupportRole) {
        query.role = filters.role;
      }
    }

    if (pagination) {
      const { pageSize, page } = pagination;
      const { offset } = getPagination(page, pageSize);

      const { rows, count } = await User.findAndCountAll({
        attributes,
        where: query,
        limit: pageSize,
        order: sort,
        offset,
      });

      return {
        data: rows.map((user) => user.get()),
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
      };
    }

    const users = await User.findAll({
      attributes,
      where: query,
      order: sort,
    });

    return { data: users.map((user) => user.get()) };
  };

  public updateById = async (uuid: string, data: Partial<IUserDto>) => {
    const user = await User.findOne({ where: { uuid } });
    const updatedUser = await user?.update(data);

    return updatedUser?.get();
  };

  public async create({ password, ...rest }: IUserCreationDto) {
    const passwordHashed = await this.generatePasswordHash(password);

    const user = {
      password: passwordHashed,
      ...rest,
    };

    return (await User.create(user)).get();
  }

  public generatePasswordHash = async (password: string) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  };

  public validatePassword = async (password: string, passwordHashed: string) => {
    return await bcrypt.compare(password, passwordHashed);
  };

  private getUsersCommonFilterQuery = (filters: IUsersFilters | ISupportFilters) => {
    const { email, firstname, lastname, account_status } = filters;
    const filterQuery: WhereOptions<IUserDto> = {};

    filterQuery.is_deactivated = Number(account_status === AccountStatus.deactivated);
    if (firstname) {
      filterQuery.firstname = {
        [Op.substring]: firstname,
      };
    }
    if (lastname) {
      filterQuery.lastname = {
        [Op.substring]: lastname,
      };
    }
    if (email) {
      filterQuery.email = {
        [Op.substring]: email,
      };
    }

    return filterQuery;
  };
}

export default UserService;
