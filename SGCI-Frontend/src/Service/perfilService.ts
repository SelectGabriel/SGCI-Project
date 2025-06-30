import { BehaviorSubject } from 'rxjs';

class PerfilService {
  private isAdminModeSubject = new BehaviorSubject<boolean>(false);

  public readonly isAdminMode$ = this.isAdminModeSubject.asObservable();

  toggleAdminMode(): void {
    const currentMode = this.isAdminModeSubject.getValue();
    this.isAdminModeSubject.next(!currentMode);
  }

  isAdminMode(): boolean {
    return this.isAdminModeSubject.getValue();
  }
}

export const perfilService = new PerfilService();
