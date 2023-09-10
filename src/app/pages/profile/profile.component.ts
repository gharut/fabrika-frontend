import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ProfileModel} from "./profile-model";
import {ProfileResponse} from "./profile-response";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ImageResizerComponent} from "../../components/media/image-resizer/image-resizer.component";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {ToastrService} from "ngx-toastr";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent implements OnInit {
  @ViewChild('avUploadInput') avUploadInput: any;

  profile: ProfileModel = new ProfileModel()
  profileForm: FormGroup;
  avatarDialogRef: MatDialogRef<ImageResizerComponent> | null = null;
  formSubmitting: boolean = false

  avatarSrc: string = "";
  constructor(private http: HttpClient, private dialog: MatDialog, private toastr: ToastrService, private accountService: AccountService) {
    this.profileForm = new FormGroup({
      name: new FormControl(this.profile.name, [Validators.required, Validators.min(3)]),
      email: new FormControl(this.profile.email, [Validators.required, Validators.email]),
      address: new FormControl(this.profile.address, []),
      phone: new FormControl(this.profile.phone, []),
      avatar: new FormControl('', []),
      change_password: new FormControl(false, []),
      password: new FormControl('', []),
      password_repeat: new FormControl('', []),
    })
  }

  ngOnInit(): void {
    this.http.get<ProfileResponse>(`${environment.apiUrl}/profile`).subscribe(
      (result) => {
        this.profile = result.data
        this.profileForm.patchValue(this.profile)
        this.profileForm.controls['avatar'].setValue("");
        this.avatarSrc = this.profile.avatar != null ? environment.webUrl+this.profile.avatar : "";

      }
    )
  }


  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    if (event.target.files.length > 0) {
      this.openImageResizerDialog(event)
    }

  }

  openImageResizerDialog(event: any) {
    this.avatarDialogRef = this.dialog.open(ImageResizerComponent, {
      panelClass: 'warning-dialog',
      maxWidth: '250px',
    });
    this.avatarDialogRef.componentInstance.fileChangeEvent(event)

    this.avatarDialogRef.afterClosed().subscribe((croppedImage: string) => {
      // Handle the croppedImage value received from the dialog

      if (croppedImage) {
        this.profileForm.controls['avatar'].setValue(croppedImage)
      }
      this.avatarDialogRef = null
      this.avUploadInput.files = {}
    });
  }

  passwordValidation(event: MatCheckboxChange) {
    const password_validation = [Validators.required, Validators.minLength(6)]
    const password_repeat_validation = [Validators.required, this.matchValidator('password')]

    if (event.checked) {
      this.profileForm.controls['password'].addValidators(password_validation)
      this.profileForm.controls['password_repeat'].addValidators(password_repeat_validation)
    } else {
      this.profileForm.controls['password'].clearValidators()
      this.profileForm.controls['password'].updateValueAndValidity();
      this.profileForm.controls['password_repeat'].clearValidators();
      this.profileForm.controls['password_repeat'].updateValueAndValidity();
    }
  }


  matchValidator(
    matchTo
      :
      string,
    reverse ?: boolean
  ):
    ValidatorFn {
    return (control: AbstractControl):
      ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
      !!control.parent.value &&
      control.value ===
      (control.parent?.controls as any)[matchTo].value
        ? null
        : {matching: true};
    };
  }

  saveProfile() {
    if(this.profileForm.valid) {
      this.formSubmitting = true
      this.profileForm.disable()

      this.accountService.update(JSON.stringify(this.profileForm.value)).subscribe({
        next: result => {
          console.log(result)

          if(result.success) {
            this.toastr.success("Профиль успешно обнавлен.","Изменения сохранены!")
            this.profile = result.data
            this.profileForm.patchValue(result.data)
            this.profileForm.controls['avatar'].setValue("");
            this.profileForm.controls['avatar'].setValue("");
            if(result.data.avatar){
              this.avatarSrc = environment.webUrl+result.data.avatar+'?'+(new Date()).getTime();
            }
          }
          this.formSubmitting = false
          this.profileForm.enable()
        },
        error: error => {
          this.formSubmitting = false
          this.profileForm.enable()
        }
      })
    }
  }
}
