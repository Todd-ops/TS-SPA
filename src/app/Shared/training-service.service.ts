import { FormInfo } from './../training-list/formInfo';
import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TrainingServiceService {
  //public formInfo: FormInfo[]=[];
  public dataServer = 'http://10.51.8.92:440/api/Training/GetEmployeeTraining';
  @Input() item = '';
constructor(private http: HttpClient) { }

baseURL: string = "http://10.51.8.92:440/api/Training/UpdateRecords/"
headers={
  headers: new HttpHeaders({
    "Accept": "text/plain",
    'Content-Type': 'application/json'//application/json
  })
}



getEmpTraining(EmpID: any){
  let emp = `http://10.51.8.92:440/api/Training/GetEmployeeTraining/${EmpID}`;//=> remove dataServer
  return this.http.get(emp);
}

getEmpInfo(EmpID: any){
  let info = `http://10.51.8.92:440/api/Training/GetEmployeeInfo/${EmpID}`;
  return this.http.get(info)
}

getJobCode(){
  let jc = "http://10.51.8.92:440/api/Training/GetMgmtSuprvJobCode";
  return this.http.get(jc);
}

getSupervisorView(EmpID: any){
  let view = `http://10.51.8.92:440/api/Training/GetTrainingUnderSupervisor/${EmpID}`;
  return this.http.get(view)
}


postTrainingComplete(EmpID: FormInfo, EmpRcdID: FormInfo, strID: FormInfo, sDate: FormInfo): Observable<FormInfo>{
  const headerOptions = new HttpHeaders();
  //headerOptions.set('Content-Type', '');

  // const body=JSON.stringify(
  //   {
  //     EmpID: EmpID,
  //     EmpRcdID: EmpRcdID,
  //     strID: strID,
  //     sDate: sDate
  //   });

  const body={
    EmpID: EmpID,
    EmpRcdID: EmpRcdID,
    strID: strID,
    sDate: sDate
  };

  // console.log("EmpID", EmpID)
  // console.log("EmpRcdID", EmpRcdID)
  // console.log("strID", strID)
  // console.log("sDate", sDate)
  //console.log("body", body)
  return this.http.post<FormInfo>(this.baseURL, body, {"headers": headerOptions});//, {"headers": headerOptions}



}

}
