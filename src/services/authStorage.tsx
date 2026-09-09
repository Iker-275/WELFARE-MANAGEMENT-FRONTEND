
import { User } from "../types/UserType";

const USER_KEY = "authUser";

export const authStorage = {

  getUser(): User | null {

    const stored =
      localStorage.getItem(USER_KEY);

    if (!stored) {
      return null;
    }

    try {

      return JSON.parse(stored);

    } catch {

      this.clearUser();

      return null;
    }
  },


  setUser(user: User): void {

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  },


  clearUser(): void {

    localStorage.removeItem(
      USER_KEY
    );
  },
};

export default authStorage;