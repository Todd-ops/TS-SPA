import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FilterPipe } from './training-list/filter.pipe';

import { MaterialModule } from './material/material.module';
import { TrainingViewSupervisorComponent } from './training-view-supervisor/training-view-supervisor.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/training-list', pathMatch: 'full'},
  { path: 'training-list', component: TrainingListComponent },
  { path: 'training-view-supervisor', component: TrainingViewSupervisorComponent},
  { path: 'training-view-supervisor/:emplid', component: TrainingViewSupervisorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
      HeaderComponent,
      TrainingListComponent,
      TrainingViewSupervisorComponent,
      FilterPipe
   ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'top',
      useHash: true
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
