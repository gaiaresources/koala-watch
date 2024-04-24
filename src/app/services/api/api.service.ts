import { map, Observable, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { User } from "../../models/user";
import { API_URL } from "../../tokens/api";
import { PROJECT_NAME } from "../../tokens/app";
import { Dataset } from "../../models/dataset";
import { ClientRecord } from "../../models/client-record";
import { Record } from "../../models/record";


/**
 * This class provides the Biosys API service.
 */
@Injectable({
  providedIn: 'root'
})
export class APIService {

  private lastError: string | any = "";
  private lastErrorStatus: number = 0;

  private buildAbsoluteUrl(path: string, appendEndSlash: boolean = true) {
    return this.apiUrl + ((path && !path.endsWith('/')) && appendEndSlash ? path + '/' : path);
  }

  /**
   * Creates a new APIService with the injected Http.
   * @param apiUrl
   * @param projectName
   * @param {HttpClient} httpClient - The injected Http Client.
   * @constructor
   */
  constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(PROJECT_NAME) private projectName: string,
    private httpClient: HttpClient
  ) {
  }

  private resetError() {
    this.lastError = "";
    this.lastErrorStatus = 0;
  }

  /**
   * Perform a GET request on the API.
   *
   * @param url
   * @param params
   * @private
   */
  private getRequest(url: string, params: any = {}): Observable<object | null> {
    this.resetError();
    return this.httpClient.get(url, {params}).pipe(
      catchError((err, caught) => this.error(err, caught))
    );
  }

  /**
   * Perform a POST request on the API.
   *
   * @param url
   * @param body
   * @private
   */
  private postRequest(url: string, body: object): Observable<object | null> {
    this.resetError();
    return this.httpClient.post(url, body,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.error(err, caught))
      );
  }

  public createRecord(record: object): Observable<Record | null> {
    return this.postRequest(this.buildAbsoluteUrl('records'), record);
  }

  /**
   * @param err
   * @param caught
   * @private
   */
  private error(err: any, caught: any) {
    const error = err.error;
    if (Array.isArray(error)) {
      this.lastError = error.shift();
    } else if (error.hasOwnProperty('non_field_errors')) {
      this.lastError = error['non_field_errors'].shift();
    } else {
      this.lastError = error;
    }
    this.lastErrorStatus = err.status;
    console.log(this.lastError, this.lastErrorStatus, error);
    return of(null);
  }

  /**
   * Get the error message of the last error.
   */
  public getLastError(): string | any {
    return this.lastError;
  }

  /**
   * Get the status code for the last error.
   */
  public getLastErrorStatus(): number {
    return this.lastErrorStatus;
  }

  /**
   * Get the authentication token for a given username and password.
   *
   * @param username
   * @param password
   */
  public getAuthToken(username: string, password: string): Observable<string | null> {
    return this.postRequest(
      this.buildAbsoluteUrl('auth-token'),
      {
        username: username,
        password: password
      }
    ).pipe(
      map((res: any) => res ? res['token'] : null),
    );
  }

  /**
   * Get details about the logged in user.
   */
  public whoAmI(): Observable<User | null> {
    return this.getRequest(this.buildAbsoluteUrl('whoami'));
  }

  public forgotPassword(email: string): Observable<any | null> {
    return this.postRequest(
      this.buildAbsoluteUrl('password/reset'),
      {email}
    );
  }

  public signUp(username: string, password: string, email: string, name_given: string, name_last: string): Observable<any | null> {
    return this.postRequest(
      this.buildAbsoluteUrl('user'),
      {
        username: username,
        password: password,
        email: email,
        first_name: name_given,
        last_name: name_last,
        projects: [this.projectName]
      }
    );
  }

  /*
  public changePassword(oldPassword: string, newPassword: string): Observable<object> {
    return this.httpClient.post(this.buildAbsoluteUrl('password'), {
      current_password: oldPassword,
      new_password: newPassword
    }, {
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public forgotPassword(email: string): Observable<object> {
    return this.httpClient.post(this.buildAbsoluteUrl('password/reset'), {
      email: email
    }, {
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public resetPassword(uid: string, token: string, newPassword: string): Observable<object> {
    return this.httpClient.post(this.buildAbsoluteUrl('password/reset/confirm'), {
      uid: uid,
      token: token,
      new_password: newPassword
    }, {
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getUser(id: number): Observable<User> {
    return this.httpClient.get(this.buildAbsoluteUrl('users/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getUsers(params = {}): Observable<User[]> {
    return this.httpClient.get<User[]>(this.buildAbsoluteUrl('users'), {
      params: params
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

 public getPrograms(params = {}): Observable<Program[]> {
    return this.httpClient.get<Program[]>(this.buildAbsoluteUrl('programs'), {
      params: params
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getProgramById(id: number): Observable<Program> {
    return this.httpClient.get(this.buildAbsoluteUrl('programs/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public createProgram(program: Program): Observable<Program> {
    return this.httpClient.post(this.buildAbsoluteUrl('programs'), program,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public updateProgram(program: Program): Observable<Program> {
    return this.httpClient.put(this.buildAbsoluteUrl('programs/' + program.id), program,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteProgram(id: number): Observable<Program> {
    return this.httpClient.delete(this.buildAbsoluteUrl('programs/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getProjects(params = {}): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.buildAbsoluteUrl('projects'), {
      params: params
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getProjectById(id: number): Observable<Project> {
    return this.httpClient.get(this.buildAbsoluteUrl('projects/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public createProject(project: Project): Observable<Project> {
    return this.httpClient.post(this.buildAbsoluteUrl('projects'), project,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public updateProject(project: Project): Observable<Project> {
    return this.httpClient.put(this.buildAbsoluteUrl('projects/' + project.id), project,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteProject(id: number): Observable<Project> {
    return this.httpClient.delete(this.buildAbsoluteUrl('projects/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getProjectMedia(projectId: number): Observable<ProjectMedia[]> {
    const params = {
      project: projectId.toString()
    };

    return this.httpClient.get<ProjectMedia[]>(this.buildAbsoluteUrl('project-media'), {
      params: params
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public uploadProjectMediaBinary(projectId: number, file: File): Observable<ProjectMedia> {
    const formData: FormData = new FormData();

    formData.append('project', projectId.toString());
    formData.append('file', file, file.name);

    // the content-type will be inferred from formData
    return this.httpClient.post(this.buildAbsoluteUrl('project-media'), formData)
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public uploadProjectMediaBase64(projectId: number, file: string): Observable<ProjectMedia> {
    // the content-type will be inferred from formData
    return this.httpClient.post(this.buildAbsoluteUrl('project-media'), {
      project: projectId,
      file: file
    }, {
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteProjectMedia(projectId: number, projectMediaId: number): Observable<ProjectMedia> {
    return this.httpClient.delete(this.buildAbsoluteUrl(`project-media/${projectMediaId}`))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getAllSites(): Observable<Site[]> {
    return this.httpClient.get<Site[]>(this.buildAbsoluteUrl('sites'))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getAllSitesForProjectID(id: number): Observable<Site[]> {
    return this.httpClient.get<Site[]>(this.buildAbsoluteUrl('projects/' + id + '/sites'))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getSiteById(id: number): Observable<Site> {
    return this.httpClient.get(this.buildAbsoluteUrl('sites/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public createSite(site: Site): Observable<Site> {
    return this.httpClient.post(this.buildAbsoluteUrl('sites/'), site,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public updateSite(site: Site): Observable<Site> {
    return this.httpClient.patch(this.buildAbsoluteUrl('sites/' + site.id), site,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteSite(id: number): Observable<Site> {
    return this.httpClient.delete(this.buildAbsoluteUrl('sites/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteSites(projectId: number, siteIds: number[]): Observable<void> {
    // httpClient.delete method doesn't accept a body argument, so use request as a work-around
    return this.httpClient.request<void>('DELETE', this.buildAbsoluteUrl('projects/' + projectId + '/sites/'),
      {
        headers: new HttpHeaders({'content-type': 'application/json'}),
        body: siteIds
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }



  public getAllDatasetsForProjectID(id: number): Observable<Dataset[]> {
    return this.httpClient.get<Dataset[]>(this.buildAbsoluteUrl('datasets'), {
      params: {project: String(id)}
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getDatasetById(id: number): Observable<Dataset> {
    return this.httpClient.get<Dataset>(this.buildAbsoluteUrl('datasets/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public createDataset(dataset: Dataset): Observable<Dataset> {
    return this.httpClient.post<Dataset>(this.buildAbsoluteUrl('datasets'), dataset,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public updateDataset(dataset: Dataset): Observable<Dataset> {
    return this.httpClient.patch<Dataset>(this.buildAbsoluteUrl('datasets/' + dataset.id), dataset,
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteDataset(id: number): Observable<Dataset> {
    return this.httpClient.delete<Dataset>(this.buildAbsoluteUrl('dataset/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }


  public getDatasetMedia(datasetId: number): Observable<DatasetMedia[]> {
    const params = {
      dataset: datasetId.toString()
    };

    return this.httpClient.get<DatasetMedia[]>(this.buildAbsoluteUrl('dataset-media'), {
      params: params
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public uploadDatasetMediaBinary(datasetId: number, file: File): Observable<DatasetMedia> {
    const formData: FormData = new FormData();

    formData.append('dataset', datasetId.toString());
    formData.append('file', file, file.name);

    // the content-type will be inferred from formData
    return this.httpClient.post(this.buildAbsoluteUrl('dataset-media'), formData)
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public uploadDatasetMediaBase64(datasetId: number, file: string): Observable<DatasetMedia> {
    // the content-type will be inferred from formData
    return this.httpClient.post(this.buildAbsoluteUrl('dataset-media'), {
      dataset: datasetId,
      file: file
    }, {
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteDatasetMedia(datasetId: number, datasetMediaId: number): Observable<ProjectMedia> {
    return this.httpClient.delete(this.buildAbsoluteUrl(`dataset-media/${datasetMediaId}`))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getRecordById(id: number): Observable<Record> {
    return this.httpClient.get<Record>(this.buildAbsoluteUrl('records/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public createRecord(record: Record, strict = true): Observable<Record> {
    // strict is evaluated to true on the server if the parameter is passed with any value
    const params = strict ? {strict: 'true'} : {};

    return this.httpClient.post<Record>(this.buildAbsoluteUrl('records'), record, {
      // TODO Why doesn't this work? is it needed?
      // params: params,
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public updateRecord(id: number, record: Record, strict = true): Observable<Record> {
    // strict is evaluated to true on the server if the parameter is passed with any value
    const params = strict ? {strict: 'true'} : {};

    return this.httpClient.put(this.buildAbsoluteUrl('records/' + id), record, {
      // TODO Why doesn't this work? is it needed?
      // params: params,
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public updateRecordValidated(id: number, validated: boolean, strict = false): Observable<Record> {
    // strict is evaluated to true on the server if the parameter is passed with any value
    const params = strict ? {strict: 'true'} : {};

    return this.httpClient.patch(this.buildAbsoluteUrl('records/' + id), {validated: validated}, {
      // TODO Why doesn't this work? is it needed?
      // params: params,
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public updateRecordLocked(id: number, locked: boolean, strict = false): Observable<Record> {
    // strict is evaluated to true on the server if the parameter is passed with any value
    const params = strict ? {strict: 'true'} : {};

    return this.httpClient.patch(this.buildAbsoluteUrl('records/' + id), {locked: locked}, {
      // TODO Why doesn't this work? is it needed?
      // params: params,
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public updateRecordDataField(id: number, data: object, strict = false): Observable<Record> {
    // strict is evaluated to true on the server if the parameter is passed with any value
    const params = strict ? {strict: 'true'} : {};

    return this.httpClient.patch(this.buildAbsoluteUrl('records/' + id), {data: data}, {
      // TODO Why doesn't this work? is it needed?
      // params: params,
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteRecord(id: number): Observable<Record> {
    return this.httpClient.delete(this.buildAbsoluteUrl('records/' + id))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteRecords(datasetId: number, recordIds: number[]): Observable<void> {
    // httpClient.delete method doesn't accept a body argument, so use request as a work-around
    return this.httpClient.request<void>('DELETE', this.buildAbsoluteUrl('datasets/' + datasetId + '/records/'),
      {
        headers: new HttpHeaders({'content-type': 'application/json'}),
        body: recordIds
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public deleteAllRecords(datasetId: number): Observable<void> {
    // httpClient.delete method doesn't accept a body argument, so use request as a work-around
    return this.httpClient.request<void>('DELETE', this.buildAbsoluteUrl('datasets/' + datasetId + '/records/'),
      {
        headers: new HttpHeaders({'content-type': 'application/json'}),
        body: JSON.stringify('all')
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getRecordMedia(recordId: number): Observable<RecordMedia[]> {
    const params = {
      record: recordId.toString()
    };

    return this.httpClient.get<RecordMedia[]>(this.buildAbsoluteUrl('media'), {
      params: params
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public uploadRecordMediaBinary(recordId: number, file: File): Observable<RecordMedia> {
    const formData: FormData = new FormData();

    formData.append('record', recordId.toString());
    formData.append('file', file, file.name);

    // the content-type will be inferred from formData
    return this.httpClient.post(this.buildAbsoluteUrl('media'), formData)
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public uploadRecordMediaBase64(recordId: number, file: string): Observable<RecordMedia> {
    // the content-type will be inferred from formData
    return this.httpClient.post(this.buildAbsoluteUrl('media'), {
      record: recordId,
      file: file
    }, {
      headers: new HttpHeaders({'content-type': 'application/json'})
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getStatistics(): Observable<Statistic> {
    return this.httpClient.get<Statistic>(this.buildAbsoluteUrl('statistics'), {})
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getModelChoices(modelName: string, fieldName: string): Observable<ModelChoice[]> {
    return this.getModelMetadata(modelName).pipe(
      map((metaData) => metaData.actions['POST'][fieldName]['choices'])
    )
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getModelMetadata(modelName: string): Observable<any> {
    return this.httpClient.options(this.buildAbsoluteUrl(modelName))
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getSpecies(search?: string): Observable<any> {
    const params: any = {};
    if (search) {
      params['search'] = search;
    }
    return this.httpClient.get(this.buildAbsoluteUrl('species'), {
      params: params
    })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public getRecordsUploadURL(datasetId: number): string {
    return this.buildAbsoluteUrl('datasets/' + datasetId + '/upload-records/');
  }

  public getProjectSiteUploadURL(projectId: number): string {
    return this.buildAbsoluteUrl('projects/' + projectId + '/upload-sites/');
  }

  public getInferDatasetURL(): string {
    return this.buildAbsoluteUrl('utils/infer-dataset/');
  }

  public recordDataToGeometry(datasetId: number, geometry: GeoJSON.GeometryObject, data: any) {
    return this.httpClient.post(this.buildAbsoluteUrl('utils/data-to-geometry/dataset/' + datasetId), {
        geometry: geometry,
        data: data
      },
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public recordGeometryToData(datasetId: number, geometry: GeoJSON.GeometryObject, data: any) {
    return this.httpClient.post(this.buildAbsoluteUrl('utils/geometry-to-data/dataset/' + datasetId), {
        geometry: geometry,
        data: data
      },
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
      .pipe(
        catchError((err, caught) => this.handleError(err, caught))
      );
  }

  public exportRecords(startDate?: Date, endDate?: Date, speciesName?: string, datasetId?: number,
                       format: string = 'csv', validatedOnly?: boolean, includeLocked?: boolean): Observable<Blob> {
    const params = {
      output: format
    };

    if (startDate) {
      params['datetime__gte'] = startDate.toISOString();
    }

    if (endDate) {
      params['datetime__lte'] = endDate.toISOString();
    }

    if (speciesName) {
      params['species_name'] = speciesName;
    }

    if (datasetId) {
      params['dataset__id'] = datasetId;
    }

    if (validatedOnly) {
      params['validated'] = true;
    }

    // if users dont specify to include locked records, only include unlocked records
    if (!includeLocked) {
      params['locked'] = false;
    }

    return this.httpClient.get(this.buildAbsoluteUrl('records/'), {
      responseType: 'blob',
      params: params
    }).pipe(
      catchError((err, caught) => this.handleError(err, caught))
    );
  }

*/

  public logout(): Observable<any> {
    return this.getRequest(this.buildAbsoluteUrl('logout'));
  }

  /**
   * Gets the dataset information for the current project.
   */
  public getDatasets(): Observable<Dataset[]> {
    return this.getRequest(this.buildAbsoluteUrl('datasets'), {
      project__name: this.projectName,
    }) as Observable<Dataset[]>;
  }

  public getRecordsByDatasetId(id: number, params: any = {}): Observable<ClientRecord[]> {
    params['dataset__id'] = id;
    return this.getRecords(params);
  }

  public getRecords(params: any = {}): Observable<ClientRecord[]> {
    return this.getRequest(
      this.buildAbsoluteUrl('records'), {
        params: params
      }) as Observable<ClientRecord[]>;
  }


}
