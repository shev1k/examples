class CookieService {
  public setCookie(cname: string, cvalue: string, seconds: number) {
    const d = new Date();
    d.setTime(d.getTime() + seconds * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  public deleteCookie(cname: string) {
    const expires = 'expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = cname + '=null;' + expires + ';path=/';
  }

  public getCookie(cname: string) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  public getTokens() {
    const accessToken = this.getCookie('accessToken');
    const refreshToken = this.getCookie('refreshToken');

    return {
      accessToken,
      refreshToken,
    };
  }

  public setAuthCookie({
    accessToken,
    refreshToken,
    expiresIn,
  }: {
    accessToken?: string;
    refreshToken?: string;
    expiresIn: number;
  }) {
    if (accessToken) this.setCookie('accessToken', accessToken, expiresIn);
    if (refreshToken)
      this.setCookie('refreshToken', refreshToken, expiresIn * 24 * 60);
  }

  public deleteAuthCookies() {
    this.deleteCookie('accessToken');
    this.deleteCookie('refreshToken');
  }
}

const cookieService = new CookieService();

export default cookieService;
