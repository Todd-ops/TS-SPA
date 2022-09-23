import { FormInfo } from './../training-list/formInfo';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TrainingServiceService {
  public formInfo: FormInfo[]=[];
  public dataServer = 'http://10.51.8.92:440/api/Training/GetEmployeeTraining';
constructor(private http: HttpClient, ) { }



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
//Call to the api in question....
postTrainingComplete(EmpID: number, EmpRcdID: number, strID: string, sDate: Date): Observable<FormInfo>{

  return this.http.post<FormInfo>(`http://10.51.8.92:440/api/Training/UpdateRecords/${EmpID}/${EmpRcdID}/${strID}/${sDate}`, [EmpID, EmpRcdID, strID, sDate]);
}
//EmpID: number, EmpRcdID: number, strID: string, sDate: Date
//(EmpID: FormInfo, EmpRcdID: FormInfo, strID: FormInfo, sDate: FormInfo): Observable<FormInfo>
}
