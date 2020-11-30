import { Component, OnInit } from "@angular/core";
import { MockArticulosService } from "../../services/mock-articulos.service";
import { MockArticulosFamiliasService } from "../../services/mock-articulos-familias.service";
import { Categoria } from "../../models/categoria";
import { CategoriasService } from "../../services/categorias.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";


//pais
@Component({
  selector: "app-categorias",
  templateUrl: "./categorias.component.html",
  styleUrls: ["./categorias.component.css"]
})
export class CategoriasComponent implements OnInit {
  Titulo = "categorias";
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; 
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

  Lista: Categoria[] = [];
  RegistrosTotal: number;
  SinBusquedasRealizadas = true;

  Pagina = 1; // inicia pagina 1

  FormFiltro: FormGroup;
  FormReg: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private categoriasService: CategoriasService,
    private modalDialogService: ModalDialogService
  ) { }

  ngOnInit() {
    this.FormReg = this.formBuilder.group({
      IdCategoria: [0],
      Nombre: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(30)]
      ],
      FechaAct: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
          )
        ]
      ],
      CantEmpleados: [null, [Validators.required, Validators.pattern("[0-9]{1,10}")]],
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    //this.FormReg.reset({ Activo: true });
    this.submitted = false;
    this.FormReg.markAsUntouched();
  }

  
  Buscar() {
    this.SinBusquedasRealizadas = false;
    this.categoriasService
      .get()
      .subscribe((res: any) => {
        this.Lista = res;
        this.RegistrosTotal = res.RegistrosTotal;
      });
  }

    Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaAct.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaAct = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (itemCopy.IdCategoria == 0 || itemCopy.IdCategoria == null) {
      itemCopy.IdCategoria = 0;
      this.categoriasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert("Registro agregado correctamente.");
        this.Buscar();
      });
    }
  }

  Volver() {
    this.AccionABMC = "L";
  }

}