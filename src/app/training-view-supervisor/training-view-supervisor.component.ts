import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingServiceService } from '../Shared/training-service.service';

@Component({
  selector: 'app-training-view-supervisor',
  templateUrl: './training-view-supervisor.component.html',
  styleUrls: ['./training-view-supervisor.component.css']
})
export class TrainingViewSupervisorComponent implements OnInit {
  public empList: any = [];

  constructor(private trainingService: TrainingServiceService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

  }


  getSupView(EmplID: number){
    this.trainingService.getSupervisorView(EmplID).subscribe((list: any) => {
      this.empList = list;
      console.log(this.empList)
    })
  }


}



