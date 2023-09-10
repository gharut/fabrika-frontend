import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { CheckboxControlValueAccessor } from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {TagService} from "../../../../services/tag.service";
import {Tag} from "../../../../models/tags/tag.model";
import {TAG_TYPES} from "../../../../constants/tag_types";


@Component({
  selector: 'app-create-role-dialog',
  styleUrls: ['./edit-tag-dialog.component.scss'],
  templateUrl: './edit-tag-dialog.component.html',
  providers: [CheckboxControlValueAccessor]
})
export class EditTagDialogComponent implements OnInit {
  tagForm!: FormGroup;
  readonly TAG_TYPES = TAG_TYPES;
  formSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EditTagDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private tagService: TagService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.tagForm = this.formBuilder.group({
      name: [this.data.tag.name, {
        validators: [Validators.required],
      }],
      type: [this.data.tag.type, {
        validators: [Validators.required],
      }],
    });
  }

  onSubmit() {
    if (this.tagForm.invalid) {
      return;
    }

    const newTag: Tag = {
      name: this.tagForm.value.name,
      type: this.tagForm.value.type,
    };

    this.formSubmitting = true
    this.tagService.updateTag(this.data.tag.id, newTag).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Категория успешно создана!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Категория не создана!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Категория не создана!", "Произошла ошибка")
        this.dialogRef.close();
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
