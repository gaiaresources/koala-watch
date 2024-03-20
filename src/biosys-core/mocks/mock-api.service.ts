import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { throwError as observableThrowError, Observable, Subscriber } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as GeoJSON from 'geojson';

import { APIError, User, Program, Project, Dataset, Site, Record, Statistic, ModelChoice, RecordMedia, DatasetMedia,
    ProjectMedia
} from '../interfaces/api.interfaces';
import { environment } from '../../environments/environment';

/**
 * This class provides the Biosys API service.
 */
@Injectable()
export class MockAPIService {
    private readonly baseUrl: string;
    private _receivedUnauthenticatedError = false;

    public get receivedUnauthenticatedError() {
        if (this._receivedUnauthenticatedError) {
            this._receivedUnauthenticatedError = false;
            return true;
        }

        return false;
    }

    private handleError(error: any, caught: Observable<any>) {
        const apiError: APIError = {
            status: error.status,
            statusText: error.statusText,
            msg: ''
        };
        const body = error.error;
        // the error message is either the body itself or in a 'detail' property
        if ('detail' in body) {
            apiError.msg = body['detail'];
        } else {
            apiError.msg = body;
        }

        this._receivedUnauthenticatedError = error.status === 401;

        return observableThrowError(apiError);
    }

    private buildAbsoluteUrl(path: string, appendEndSlash: boolean = true) {
        return this.baseUrl + ((path && !path.endsWith('/')) && appendEndSlash ? path + '/' : path);
    }

    /**
     * Creates a new APIService with the injected Http.
     * @param {HttpClient} httpClient - The injected Http client.
     * @constructor
     */
    constructor(private httpClient: HttpClient) {
        this.baseUrl = environment.server + environment.apiExtension;
    }

    public getAuthToken(username: string, password: string): Observable<object> {
        return new Observable((observer: Subscriber<any>) => {
            if (username === 'user1' && password === 't35tP@55w0rd') {
                observer.next({
                    token: '143f1a51147ddfaab533fa09af6d8d7742e575ag'
                });
            } else {
                observer.error(new HttpErrorResponse({
                    error: 'Incorrect email / password',
                    statusText: 'Authentication errror',
                    status: 401
                }));
            }
        }).pipe(
            catchError((err, caught) => this.handleError(err, caught))
        );
    }

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

    public whoAmI(): Observable<User> {
        return this.httpClient.get(this.buildAbsoluteUrl('whoami'))
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

    public getDatasets(params = {}): Observable<Dataset[]> {
        return this.httpClient.get<Dataset[]>(this.buildAbsoluteUrl('datasets'), {
                params: params
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

    public getRecordsByDatasetId(id: number, params = {}): Observable<any> {
        params['dataset__id'] = id;
        return this.getRecords(params);
    }

    public getRecords(params = {}): Observable<Record[]> {
        return this.httpClient.get<Record[]>(this.buildAbsoluteUrl('records'), {
                params: params
            })
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

        return this.httpClient.post(this.buildAbsoluteUrl('records'), record, {
                params: params,
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
                params: params,
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
                params: params,
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
                params: params,
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
                params: params,
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
                         format: string = 'csv') {
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

        return this.httpClient.get(this.buildAbsoluteUrl('records/'), {
            responseType: 'blob',
            params: params
        }).pipe(
            catchError((err, caught) => this.handleError(err, caught))
        );
    }

    public logout(): Observable<any> {
        return this.httpClient.get(this.buildAbsoluteUrl('logout'))
            .pipe(
                catchError((err, caught) => this.handleError(err, caught))
            );
    }
}
