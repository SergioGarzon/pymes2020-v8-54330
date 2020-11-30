import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { of } from "rxjs";
import { Categoria } from "../models/categoria";

@Injectable({
  providedIn: "root"
})

@Injectable()
export class CategoriasService {

  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    
    this.resourceUrl = "https://pav2.azurewebsites.net/api/categorias/";
  }

  get() {
    let params = new HttpParams();

    return this.httpClient.get(this.resourceUrl, { params: params });
  }

  post(obj: Categoria) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

}