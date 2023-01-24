import { Response } from 'express';
import * as R from 'ramda';

import { AccountType } from '@/enums';
import { UserService } from '@/services';
import { getAccountType, getPaginationFromQuery } from '@/utils';
import {
  IGetSupportsRequest,
  IGetUsersRequest,
  IUpdateUserStatusRequest,
} from '@/interfaces/dashboard';

export default class DashboardController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getUsers = async ({ query, headers }: IGetUsersRequest, response: Response) => {
    const user = await this.userService.getUserByToken(headers.authorization);
    const accountType = getAccountType(user.role);
    const pagination = getPaginationFromQuery(query);
    const filters = R.pick(
      [
        'account_status',
        'role',
        'firstname',
        'lastname',
        'email',
        'cafe_number',
        'field',
        'order',
      ],
      query,
    );

    if (accountType === AccountType.user) {
      const usersCafeNumbers = user.cafe_number.split(',');
      const cafeNumbers = R.uniq([...(filters.cafe_number || []), ...usersCafeNumbers]);

      const hasAccessToEveryRequestedCafe = cafeNumbers.every((cafeNumber) =>
        usersCafeNumbers.includes(cafeNumber),
      );

      if (!hasAccessToEveryRequestedCafe) return response.sendStatus(403);

      filters.cafe_number = cafeNumbers;
    }

    const { data, ...metadata } = await this.userService.getUsers(
      AccountType.user,
      filters,
      pagination,
    );

    response.status(200).send({ data, ...metadata });
  };

  public getSupports = async ({ query }: IGetSupportsRequest, response: Response) => {
    const filters = R.pick(
      ['account_status', 'role', 'firstname', 'lastname', 'email', 'field', 'order'],
      query,
    );

    const { data } = await this.userService.getUsers(AccountType.support, filters);

    response.status(200).send({ data });
  };

  public activateUser = async (request: IUpdateUserStatusRequest, response: Response) => {
    try {
      const user = await this.userService.updateById(request.body.uuid, {
        is_deactivated: 0,
      });
      return response.status(200).json({ data: user });
    } catch (error) {
      return response.status(500).json({ errors: { message: error } });
    }
  };

  public deactivateUser = async (
    request: IUpdateUserStatusRequest,
    response: Response,
  ) => {
    try {
      const user = await this.userService.updateById(request.body.uuid, {
        is_deactivated: 1,
      });
      return response.status(200).json({ data: user });
    } catch (error) {
      return response.status(500).json({ errors: { message: error } });
    }
  };
}
