import {Component, computed, signal, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HeaderComponent} from "../../components/header/header.component";
import {User} from '../../models/user';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {UserService} from '../../services/user.service';
import {Role, RoleLabels} from '../../models/role.enum';
import {ToastService} from '../../services/toast.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-users-page',
    imports: [
        FormsModule,
        HeaderComponent,
        ReactiveFormsModule,
        TranslatePipe
    ],
  templateUrl: './users-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './users-page.scss'
})
export class UsersPage {


  formGroup!: FormGroup;
  users = signal<User[]>([])
  selected = signal<User | null>(null);
  searchText = signal('');
  isEditing = signal(false);
  usersFiltered = computed(() => {
    const term = this.searchText().toLowerCase();
    const users = this.users().filter(item =>
      item.name.toLowerCase().includes(term)
    );
    return users.filter( usr => usr.code != 'develop')
  });


  /**
   *
   * @param userService
   * @param formBuilder
   * @param errorHandler
   * @param toastService
   */
  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private errorHandler: ErrorHandlerService,
              private toastService: ToastService,
              private translate: TranslateService) {

  }


  /**
   *
   */
  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: users => {
        this.users.set(users);
      }
    });
    this.initFormControl()
  }


  /**
   *
   * @private
   */
  private initFormControl() {
    this.formGroup = this.formBuilder.group({
      id: [null, []],
      name: ["", [Validators.required]],
      code: ["", [Validators.required]],
      roles: [[], [Validators.required]],
    });
    this.resetForm();
  }


  /**
   *
   * @param event
   * @param role
   */
  onRoleChange(event: Event, role: Role): void {
    const checkbox = event.target as HTMLInputElement;
    const selectedRoles: Role[] = this.formGroup.value.roles ?? [];

    if (checkbox.checked) {
      this.formGroup.patchValue({
        roles: [...selectedRoles, role]
      });
    } else {
      this.formGroup.patchValue({
        roles: selectedRoles.filter(r => r !== role)
      });
    }

    // Mark as touched for validation
    this.formGroup.get('roles')?.markAsTouched();
  }

  /**
   * Add a new record
   */
  add(): void {
    if (this.formGroup.valid) {
      const newTable: User = this.formGroup.value;
      this.userService.save(newTable).subscribe({
        next: user => {
          this.users.set([...this.users(), user]);
          this.toastService.show(this.translate.instant('PAGES_B.USERS.CREATED'), 2000, "success");

        },
        error: err => {
          this.toastService.show(this.translate.instant('PAGES_B.USERS.CREATE_ERROR'), 2000, "error");
          console.error(this.errorHandler.parseError(err));
        }
      });
    }
    this.resetForm();
  }

  /**
   * Add a new record
   * @param user
   */
  edit(user: User): void {
    this.selected.set(user);
    this.isEditing.set(true);
    this.formGroup.patchValue(user);
  }

  /**
   * Update an existing record
   */
  update(): void {
    if (this.formGroup.valid) {
      const newUser: User = this.formGroup.value;
      this.userService.save(newUser).subscribe({
        next: user => {
          const updatedTables = this.users().map(t =>
            t.id === user.id ? { ...user } : t
          );
          this.users.set(updatedTables);
          this.toastService.show(this.translate.instant('PAGES_B.USERS.UPDATED'), 2000, "success");
        },
        error: err => {
          this.toastService.show(this.translate.instant('PAGES_B.USERS.UPDATE_ERROR'), 2000, "error");
          console.error(this.errorHandler.parseError(err));
        }
      });
    }
    this.resetForm();
  }


  /**
   * Delete a record by ID
   * @param id
   */
  delete(id: number): void {
    this.userService.delete(id).subscribe({
      next: () => {
        const users = this.users().filter(it => it.id !== id);
        this.users.set(users);
        this.toastService.show(this.translate.instant('PAGES_B.USERS.DELETED'), 2000, "success");

      },
      error: err => {
        this.toastService.show(this.translate.instant('PAGES_B.USERS.DELETE_ERROR'), 2000, "error");
        console.error(this.errorHandler.parseError(err));
      }
    });
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.selected.set(null);
    this.isEditing.set(false);
    this.searchText.set("");
    this.formGroup.patchValue({id: null, name: '', code: '', roles: []});
    this.formGroup.reset();
  }

  /**
   *
   * @param roles
   */
  roleKey(role: Role): string {
    return RoleLabels[role] ?? role;
  }

  protected readonly Role = Role;
  protected readonly Object = Object;
}
