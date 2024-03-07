import { Injectable} from "@angular/core";

/**
 * Service used to share authenticated state.
 * State is checked and updated on app page + log-in/out
 */
@Injectable({
    providedIn: 'root',
})
export class AuthenticatedService {
    private authenticated = false;

    setAuthenticated(authenticated: boolean) {
        this.authenticated = authenticated
    }

    isAuthenticated(): boolean {
        return this.authenticated
    }
}
