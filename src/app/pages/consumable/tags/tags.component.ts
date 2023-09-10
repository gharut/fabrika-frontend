import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {RoleWithDeleting} from "../../roles/roles.component";
import {TabService} from "@coreui/angular";
import {TagService} from "../../../services/tag.service";
import {Tag, TagWithCount} from "../../../models/tags/tag.model";
import {AccountService} from "../../../services/account.service";
import {CreateUserDialogComponent} from "../../users/components/create-user-dialog/create-user-dialog.component";
import {User} from "../../../models/users/user.model";
import {MatDialog} from "@angular/material/dialog";
import {CreateTagDialogComponent} from "./create-tag-dialog/create-tag-dialog.component";
import {Role} from "../../../models/roles/role.model";
import {UpdateRoleDialogComponent} from "../../roles/update-role-dialog/update-role-dialog.component";
import {EditTagDialogComponent} from "./edit-tag-dialog/edit-tag-dialog.component";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit{
  tags?: TagWithCount[];
  tableData!: MatTableDataSource<TagWithCount>;
  constructor(
    private tagService: TagService,
    private accountService: AccountService,
    private dialog: MatDialog,
  ) {
    this.tableData = new MatTableDataSource<TagWithCount>();
    this.tagService.listWithCounts().subscribe(data => this.fetchTableData(data))
  }
  ngOnInit(): void {
  }

  fetchTableData(tags: TagWithCount[]) {
    console.log(tags);
    this.tags = tags;
    this.tableData = new MatTableDataSource<TagWithCount>(this.tags)
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }

  openCreateTagDialog() {
    const dialogRef = this.dialog.open(CreateTagDialogComponent);

    dialogRef.afterClosed().subscribe(tag => {
      if (tag) {
        this.tags!.push(tag);
        this.tableData = new MatTableDataSource<TagWithCount>(this.tags)
      }
    });
  }

  openUpdateTagDialog(tag: Tag) {
    const dialogRef = this.dialog.open(EditTagDialogComponent, {
      data: {
        tag
      }
    });

    dialogRef.afterClosed().subscribe(tag => {
      if (tag) {
        const index = this.tags!.findIndex(r => r.id === tag.id);
        console.log(index)
        if (index !== -1) {
          this.tags![index] = tag;
          this.tableData = new MatTableDataSource<Role>(this.tags)
        }

      }
    });
  }

}
