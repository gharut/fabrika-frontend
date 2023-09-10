import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  styleUrls: ['./create-tag-dialog.component.scss'],
  templateUrl: './create-tag-dialog.component.html',
  providers: [CheckboxControlValueAccessor]
})
export class CreateTagDialogComponent implements OnInit {
  tagForm!: FormGroup;
  readonly TAG_TYPES = TAG_TYPES;
  formSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CreateTagDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private tagService: TagService,
  ) {}

  ngOnInit() {
    this.tagForm = this.formBuilder.group({
      name: ['', {
        validators: [Validators.required],
      }],
      type: ['', {
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
    this.tagService.createTag(newTag).subscribe({

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
