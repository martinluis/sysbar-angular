import {Component, computed, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HeaderComponent} from "../../components/header/header.component";
import {User} from '../../models/user';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {UserService} from '../../services/user.service';
import {Role, RoleLabels} from '../../models/role.enum';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-users-page',
    imports: [
        FormsModule,
        HeaderComponent,
        ReactiveFormsModule
    ],
  templateUrl: './users-page.html',
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
    return this.users().filter(item =>
      item.name.toLowerCase().includes(term)
    );
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
              private toastService: ToastService) {

  }


  /**
   *
   */
  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: users => {
        console.log(users)
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
          this.toastService.showSuccess('Usuario creado', 2000, "success");

        },
        error: err => {
          this.toastService.showSuccess('Error al crear el usuario', 2000, "error");
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
          this.toastService.showSuccess('Usuario actualizado', 2000, "success");
        },
        error: err => {
          this.toastService.showSuccess('Error al actualizar el usuario', 2000, "error");
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
        this.toastService.showSuccess('Usuario eliminado', 2000, "success");

      },
      error: err => {
        this.toastService.showSuccess('Error al borrar el usuario', 2000, "error");
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
  formatSelectedRoles(roles: Role[]){
    let stringRoles: string[] = []
    for (const role of roles) {
        stringRoles.push(RoleLabels[role]);
    }
    return stringRoles.join(", ");
  }

  protected readonly Role = Role;
  protected readonly Object = Object;
  protected readonly RoleLabels = RoleLabels;
}
