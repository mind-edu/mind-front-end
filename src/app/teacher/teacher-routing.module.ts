import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TCoursesComponent} from './t-courses/t-courses.component';
import {TCourseComponent} from './t-course/t-course.component';
import {TMainComponent} from './t-main/t-main.component';

const teacherRoutes: Routes = [
  {
    path: 't',
    component: TMainComponent,
    children: [
      {path: '', redirectTo: 'courses', pathMatch: 'full'},
      {path: 'courses', component: TCoursesComponent},
      {path: 'course/:id', component: TCourseComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(teacherRoutes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
