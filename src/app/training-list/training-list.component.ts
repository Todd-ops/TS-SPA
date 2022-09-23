import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Form, FormGroup, NgForm } from '@angular/forms'
import { TrainingServiceService } from '../Shared/training-service.service';
import { MatTableDataSource } from "@angular/material/table";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

export interface EmployeeInfo {
  courseName: string;
  dueDate: string;
  docID: number;
  courseTypeDescr: string;
  // https://www.section.io/engineering-education/angular12-material-table/
}

export interface EmployeeInfo2 {
  empName: string;
  descr: string;
  wcDesc: string;
  supervisor: string;
  jobcode: string;
}

export interface Job {
  [x: string]: any;
  jobcode: string;
}

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
  providers: [DatePipe]
})

export class TrainingListComponent implements OnInit {

  public nameForm: FormGroup;

  userID = "";

  jobCode= "";

  empTrain: any = [];

  empInfo: any = [];

  trainingSource: any = [];

  public dataSource= new MatTableDataSource<EmployeeInfo>();

  public dataSourcetwo= new MatTableDataSource<EmployeeInfo2>();

  dataSourcethree: any = [];

  displayedColumns: string[] = ['courseName', 'dueDate', 'courseTypeDescr', 'actions', 'actionLink', 'complete' ];

  displayedColumnsTwo: string[] = ['empName', 'descr', 'wcDesc', 'supervisor'];

  employeeInfo: EmployeeInfo[]=[];

  isShown: boolean = false;

  docTitleShown: boolean = false;

  url!: string;

  iFrameUrl!: SafeResourceUrl;

  displayIFrame = false;

  timeLeft: number=30;

  interval: any;

  docTitle = "Visual Work Instruction"

  myDate = new Date();

  myDateString!: string;

  docIDIndex!: number;

  timer: boolean = false;

  isSupervisorOrManager: boolean = false;

  supervisorManagerArray: any = [];

  myJobCode: any;

  secondArray: any = [];

  firstArray: any = [];

  @ViewChild('empInfoForm')
  form!: NgForm;

  myDate2 = new Date();

  formInformation: any = [];

  completeData: any;






  constructor(private trainingService: TrainingServiceService, private scroller: ViewportScroller ,private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute) {
    this.nameForm = this.formBuilder.group({
      name:'',
      empID:''

    })

   }

    ngOnInit() {
      const myDate1 = this.myDate;
      // this.myDateString = this.datePipe.transform(this.myDate, 'shortDate')
      // console.log(myDate1)
    }

    getEmpTrain(){
      this.isShown = ! this.isShown;
      this.userID=this.nameForm.get('empID')?.value;
      // console.log(this.userID);


      this.trainingService.getEmpTraining(this.userID).subscribe((x:any)=>{
        this.dataSource = x;
        console.log("Is this it?", this.dataSource)

    })

    this.trainingService.getEmpInfo(this.userID).subscribe((y: any) => {
      // this.empInfo = y;
      this.dataSourcetwo = y;
      this.dataSourcethree = y;
     console.log(this.dataSourcethree)
      this.checkJobCode();

    })

    this.trainingService.getJobCode().subscribe((z: any) => {
      this.supervisorManagerArray = z;

      this.checkJobCode();
    })

  }

  goDown(){
    this.scroller.scrollToAnchor("targetRed");
  }

  getURL(event: any){
    this.url = (`http://rdweb/visualworkinstructions/#/view-doc/${event}`);
    this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.displayIFrame= true;
    this.docTitleShown = true;
    clearTimeout(this.interval)
    this.startTimer();
    console.log(this.url)

  }

  startTimer(){
    this.timer = false;
    this.interval = setTimeout(() => {
      this.timer = true;
    }, 6000);
    console.log(this.interval)
  }

  openNewTab(courseURL: any){
    window.open(courseURL, "_blank");
    console.log(courseURL);
  }

  getIndex(docID: number){
    this.docIDIndex = docID
    console.log(this.docIDIndex)
  }

// Check for jobcodes.
//If employee jobcode is in list of mgmt/suprv, supervisor view button will appear to view employees' training.
  checkJobCode() {


    if (!this.dataSourcethree || !this.dataSourcethree[0] || !this.supervisorManagerArray.length) {
      // console.log('jobCodeThree isnt set yet', this.dataSourcethree);
      return false;
    }
    const firstArray = this.supervisorManagerArray;
    const person = this.dataSourcethree[0];

    const jobCodeToFind = person.jobcode;

    // console.log('hi todd', this.dataSourcethree);
    let jobCodeFound = false;
    firstArray.forEach((Job: any)=>{
      // console.log('in map', Job, Job.jobcode, jobCodeToFind);
      if (Job.jobcode === jobCodeToFind) {
        jobCodeFound = true;
      }
    })
    console.log('i think this should be it', jobCodeFound);

    this.isSupervisorOrManager = jobCodeFound;
    return jobCodeFound;


   }

   isDue(date: number): boolean {
    return this.myDate > new Date(date);
    }


   onComplete(docID: number){

    //get the record based on docID
    this.trainingSource = this.dataSource;
    let currentEmpTraining = this.trainingSource.find((i: any) => {return i.docID === docID});
    console.log("this is currentEmpTraining", currentEmpTraining);


    //Populate the form with product details
    this.form.setValue({
      sDate: this.datePipe.transform(this.myDate, 'yyyy-MM-dd'),
      empID: currentEmpTraining.emplid,
      EmpRecID: currentEmpTraining.empTrainRcdID,
      strID: currentEmpTraining.supervisoR_ID
    });
    console.log("the form", this.form)

    this.formInformation = this.form;

    //this.confirmBox();
   }

  confirmBox(EmpID: any, EmpRcdID: any, strID: any, sDate: any){
    Swal.fire({
      title: 'Do you want to complete this training?',
      text: 'Click yes to complete.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete!',
      cancelButtonText: 'No',

    }).then((result) =>{
      if  (result.isConfirmed) {
         //this.trainingService.postTrainingComplete().subscribe((response) => {
          // this.
         //})
        console.log("This is the data needed", this.formInformation.value)
        this.trainingService.postTrainingComplete(EmpID, EmpRcdID, strID, sDate).subscribe((response) => {
          this.completeData = response;
          console.log(response);
        })
        Swal.fire(
          'Complete!',
          'Your training has been completed.',
          'success',

        ).then((result) => {
          if (result.isConfirmed){
            //need a method to refresh the course list.
          }
        });
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Canceled', 'You will still need to complete this training', 'error');
      }
    });


  }

}






