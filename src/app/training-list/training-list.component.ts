import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Form, FormGroup, NgForm } from '@angular/forms'
import { TrainingServiceService } from '../Shared/training-service.service';
import { MatTableDataSource } from "@angular/material/table";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe, DATE_PIPE_DEFAULT_TIMEZONE, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FooterRowOutlet } from '@angular/cdk/table';

export interface EmployeeInfo {
  courseName: string;
  dueDate: string;
  docID: number;
  courseTypeDescr: string;

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

export interface SupervisorView {
  courseID: number;
  courseName: string;
  dueDate: Date;
  docID: number;
  workctR_Desc: string;
  trainTypeDescr: string;
  setTrainTime: number;
  trainedBy: string;
  linkType: string;
  courseLocation: string;
  trainTypeID: number;
  courseTypeDescr: string;
  empTrainRcdID: number;
  recordRevDate: Date;
  emplid: number;
  name: string;
  supervisoR_ID: number;

}

type LessonType = {
  courseID: number;
  courseName: string;
  dueDate: number;
  docID: number;
  workctR_Desc: string;
  trainTypeDescr: string;
  setTrainTime: number;
  trainedBy: string;
  linkType: string;
  courseLocation: string;
  trainTypeID: number;
  courseTypeDescr: string;
  empTrainRcdID: number;
  recordRevDate: Date;
  emplid: number;
  name: string;
  supervisoR_ID: number;
}

type EmployeeLessonsType = {
  [key:string]: [LessonType]
}

type LessonsPastDue = {
  dueDate: number;
}

type EmployeeLessonsPastDue = {
  array: any;
  [key:number]: LessonsPastDue
}

@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
  providers: [DatePipe],
})
export class TrainingListComponent implements OnInit {
  public nameForm: FormGroup;

  userID = '';

  jobCode = '';

  empTrain: any = [];

  empInfo: any = [];

  trainingSource: any = [];

  public dataSource = new MatTableDataSource<EmployeeInfo>();

  public dataSourcetwo = new MatTableDataSource<EmployeeInfo2>();

  dataSourcethree: any = [];

  displayedColumns: string[] = [
    'courseName',
    'dueDate',
    'courseTypeDescr',
    'actions',
    'actionLink',
    'complete',
  ];

  displayedColumnsTwo: string[] = ['empName', 'descr', 'wcDesc', 'supervisor'];

  employeeInfo: EmployeeInfo[] = [];

  isShown: boolean = false;

  docTitleShown: boolean = false;

  url!: string;

  iFrameUrl!: SafeResourceUrl;

  displayIFrame = false;

  timeLeft: number = 30;

  interval: any;

  docTitle = 'Visual Work Instruction';

  myDate = new Date();

  myDateString!: string;

  docIDIndex!: number;

  courseIDIndex!: number;

  courseTypeDescr!: string;

  handsOn:string = "Hands-On";

  powerPoint: string = "Power Point";

  visualWorkInstruction: string = "Visual Work Instruction";

  timer: boolean = false;

  isSupervisorOrManager: boolean = false;

  supervisorManagerArray: any = [];

  lessonsPastDue: any = [];

  myJobCode: any;

  secondArray: any = [];

  firstArray: any = [];

  @ViewChild('empInfoForm')
  form!: NgForm;

  myDate2 = new Date();

  public formInformation: FormGroup;

  selectDiv = false;

  completeData: any;

  getButton = false;

  supervisorData: any = [];

  panelOpenState = false;

  list1: any = [];

  employeeLessons: EmployeeLessonsType = {};

  empPastDueLessons: EmployeeLessonsPastDue = {
    array: undefined
  };

  list2: any = {};

  filterMetadata = { count: 0 };

  filtre!: string;

  lessonsResponse: any = [];

  expiredLessons: any = [];

  docConfirmation: string = '';

  constructor(
    private trainingService: TrainingServiceService,
    private scroller: ViewportScroller,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.nameForm = this.formBuilder.group({
      name: '',
      empID: '',
    });

    this.formInformation = this.formBuilder.group({
      sDate: '',
      empID: '',
      EmpRcdID: '',
      strID: '',
    });
  }

  ngOnInit() {
    const myDate1 = this.myDate;
    //this.isShown = !this.isShown
    // this.myDateString = this.datePipe.transform(this.myDate, 'shortDate')
    // console.log(myDate1)
  }

  getEmpTrain() {
    this.isShown = !this.isShown;
    this.userID = this.nameForm.get('empID')?.value;
    // console.log(this.userID);

    this.trainingService.getEmpTraining(this.userID).subscribe((x: any) => {
      this.dataSource = x;
      console.log('Is this it?', this.dataSource);
    });

    this.trainingService.getEmpInfo(this.userID).subscribe((y: any) => {
      // this.empInfo = y;
      this.dataSourcetwo = y;
      this.dataSourcethree = y;
      console.log(this.dataSourcethree);
      this.checkJobCode();
    });

    this.trainingService.getJobCode().subscribe((z: any) => {
      this.supervisorManagerArray = z;

      this.checkJobCode();
      this.selectDiv = false;
    });
  }

  goDown() {
    this.scroller.scrollToAnchor('targetRed');
  }

  getURL(event: any) {
    this.url = `http://rdweb/visualworkinstructions/#/view-doc/${event}`;
    this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    console.log('iFrameURL', this.iFrameUrl)
    this.displayIFrame = true;
    this.docTitleShown = true;
    clearTimeout(this.interval);
    this.startTimer();
    console.log('TheURL',this.url);
  }

  getHyperlinkURL(event: any){
    this.url = `${event}`;
    console.log('disURL',this.url)
    this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    console.log('iFrameURL', this.iFrameUrl)
    this.displayIFrame = true;
    this.docTitleShown = true;
    clearTimeout(this.interval);
    this.startTimer();
    console.log('TheURL',this.url);
  }

  getCompleteOption(){
    clearTimeout(this.interval);
    this.startTimer()
  }

  startTimer() {
    this.timer = false;
    this.interval = setTimeout(() => {
      this.timer = true;
    }, 60000);
    console.log(this.interval);
  }

  openNewTab(courseURL: any) {
    if(courseURL === null){
      this.timer = false;
      //this.doNothing()  //Add a Swal for broken link
      console.log('course url', courseURL)

    }else{
      window.open(courseURL, '_blank');
      console.log(courseURL);
    }

  }

  doNothing(){
    Swal.fire({
      title: 'Uh-oh! The link appears to be incorrect.',
      text: 'Click yes to complete.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {




        Swal.fire(
          'Complete!',
          'Your training has been completed.',
          'success'
        ).then((result) => {
          if (result.isConfirmed) {
            //need a method to refresh the course list.
            this.trainingService
              .getEmpTraining(this.userID)
              .subscribe((x: any) => {
                this.dataSource = x;
                console.log('Is this it?', this.dataSource);
              });
            this.displayIFrame = false;
            this.docTitleShown = false;
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Canceled',
            'You will still need to complete this training',
            'error'
          );
      }
    });
  }

  getIndex(empTrainRcdID: number) {
    this.docIDIndex = empTrainRcdID;
    console.log('TrainingRecord/Index',this.docIDIndex);
  }

  getCourseIndex(empTrainRcdID: number){
    this.courseIDIndex = empTrainRcdID;
    console.log('Training Record', this.courseIDIndex)
  }
//removed docID for test
  getType(courseTypeDescr: string){
    this.courseTypeDescr = courseTypeDescr;
    if(courseTypeDescr == "Hands-On"){
      console.log('course type',courseTypeDescr);
      Swal.fire('Your supervisor and training department will complete this step.');
    }else if(courseTypeDescr == "Assessment"){
      console.log('course type',courseTypeDescr);
      Swal.fire('Your supervisor and training department will complete this step.');
    }else if(courseTypeDescr == "Class Room"){
      console.log('course type',courseTypeDescr);
      Swal.fire('Your supervisor and training department will complete this step.');
    }else if(courseTypeDescr == "External"){
      console.log('course type',courseTypeDescr);
      Swal.fire('Your supervisor and training department will complete this step.');
    }else if(courseTypeDescr == "Video"){
      console.log('course type',courseTypeDescr);
      Swal.fire('Your supervisor and training department will complete this step.');
    }else{

      //this.doNothing();
      //this.onComplete(docID)
      //this.confirmBox(empID,EmpRcdID,strID,sDate)
      //this.openTryFunction(empID, EmpRcdID, strID, sDate)
    }
  }

  //This is an experiment to assure onComplete() is finished before executing confirmBox()
  //changed docID to EmpRcdID
  // openTryFunction(EmpRcdID: number, empID: number, strID: number, sDate: Date){
  //   this.onComplete(EmpRcdID).then(() => {
  //     this.confirmBox(empID,EmpRcdID,strID,sDate);
  //   });
  // }

  // Check for jobcodes.
  //If employee jobcode is in list of mgmt/suprv, supervisor view button will appear to view employees' training.
  checkJobCode() {
    if (
      !this.dataSourcethree ||
      !this.dataSourcethree[0] ||
      !this.supervisorManagerArray.length
    ) {
      // console.log('jobCodeThree isnt set yet', this.dataSourcethree);
      return false;
    }
    const firstArray = this.supervisorManagerArray;
    const person = this.dataSourcethree[0];

    const jobCodeToFind = person.jobcode;

    console.log('hi todd', firstArray);
    let jobCodeFound = false;
    firstArray.forEach((Job: any) => {
      // console.log('in map', Job, Job.jobcode, jobCodeToFind);
      if (Job.jobcode === jobCodeToFind) {
        jobCodeFound = true;
      }
    });
    console.log('i think this should be it', jobCodeFound);

    this.isSupervisorOrManager = jobCodeFound;
    return jobCodeFound;
  }

  pastDue(date: Date){
    const pastDueList: Array<any> = [this.employeeLessons]
    const list: any = {}
    for(const lesson of pastDueList){
      if(date > this.myDate2){
        list[lesson.dueDate] = [];
      }
      list[lesson.dueDate].push(lesson)
    }
    this.expiredLessons = list;
    console.log('this log',this.expiredLessons)
    // return this.expiredLessons;

  }


  isDue(date: number): boolean {
    return this.myDate > new Date(date);
  }


//changed param from docID to empRcdID for test
  onComplete(EmpRcdID: number)  {
    //get the record based on docID
    return new Promise((resolve) => {
      this.trainingSource = this.dataSource;
      let currentEmpTraining = this.trainingSource.find((i: any) => {
        //return i.docID == docID;
        return i.empTrainRcdID == EmpRcdID;

      });
      console.log('this is currentEmpTraining', currentEmpTraining);

      //Populate the form with product details
      this.formInformation.setValue({
        sDate: this.datePipe.transform(this.myDate2, 'yyyy-MM-dd h:mm:ss.ms'), //h:mm:ss
        empID: currentEmpTraining.emplid,
        EmpRcdID: currentEmpTraining.empTrainRcdID,
        strID: currentEmpTraining.supervisoR_ID,
      });
      console.log('the form', this.formInformation);
      resolve(EmpRcdID);
    });



    //this.formInformation = this.form;

    //this.confirmBox();
  }

  callPostTrainComplete(
    _empID: number,
    _EmpRcdID: number,
    _strID: number,
    _sDate: Date
  ) {
    const formValue = this.formInformation.value;

    console.log('Sending to service.ts', formValue); //This is the data being sent
    this.trainingService
      .postTrainingComplete(
        formValue.empID,
        formValue.EmpRcdID,
        formValue.strID,
        formValue.sDate
      )
      .subscribe((response) => {
        this.completeData = response;
        console.log('Server Response', this.completeData); //This is the response
      });
  }

  confirmBox(empID: number, EmpRcdID: number, strID: number, sDate: Date) {

    Swal.fire({
      title: 'Do you want to complete this training?',
      text: 'Click yes to complete.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        //this.trainingService.postTrainingComplete().subscribe((response) => {
        // this.
        //})
        console.log('This is the data needed', this.formInformation);
        //train.empID, train.EmpRecID, train.strID, train.sDate this is for Html templa
        this.callPostTrainComplete(empID, EmpRcdID, strID, sDate);
        Swal.fire(
          'Complete!',
          'Your training has been completed.',
          'success'
        ).then((result) => {
          if (result.isConfirmed) {
            //need a method to refresh the course list.
            this.trainingService
              .getEmpTraining(this.userID)
              .subscribe((x: any) => {
                this.dataSource = x;
                console.log('Is this it?', this.dataSource);
              });
            this.displayIFrame = false;
            this.docTitleShown = false;
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Canceled',
          'You will still need to complete this training',
          'error'
        );
      }
    });
  }

  toggleDiv() {
    this.isShown = false;
    this.selectDiv = !this.selectDiv;
    this.displayIFrame = false;
    this.docTitleShown = false;

    this.fillSupervisorEmpArray();
  }

  fillSupervisorEmpArray() {
    this.trainingService
      .getSupervisorView(this.userID)
      .subscribe((view: any) => {
        this.supervisorManagerArray = view;

        console.log('Supervisor View', this.supervisorManagerArray);
        this.filterView();
        //this.countPastDue()
      });
  }

  filterView() {
    const parseResult = () => {
      const results: Array<any> = this.supervisorManagerArray;
      const filtered: any = {};

      //console.log('1', this, results);
      for (const lesson of results) {
        if (!filtered[lesson.name]) {
          filtered[lesson.name] = [];
        }

        filtered[lesson.name].push(lesson);
      }
      //console.log('filtered', filtered);
      this.employeeLessons = filtered as EmployeeLessonsType;
      console.log('supervisorManager Array',this.supervisorManagerArray)
      console.log('employee lessons',this.employeeLessons)
    };
    parseResult();
    //this.countPastDue();
  }

  //This is not being used in the application
  countPastDue() {
    // this.lessonsResponse = this.employeeLessons as EmployeeLessonsType;
     const parseResult = () => {
      const result: Array<any> = this.supervisorManagerArray;
      const filter: any = {};
      const latest: any = {};
      for(const lessons of result){
        if(latest[lessons.dueDate] > this.myDate2) {
          latest[lessons.dueDate] = [];

        }
        latest[lessons.dueDate].push(lessons)
      }
      this.empPastDueLessons = latest as EmployeeLessonsPastDue;
      console.log('filter',latest)
    };
    parseResult();
    console.log('lessonsResponse',this.empPastDueLessons)

  }

  refresh(){
    window.location.reload();
  }

}







