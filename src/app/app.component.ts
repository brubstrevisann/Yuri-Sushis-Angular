import { Component, TemplateRef, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeralService } from '../app/services/geral.service'
import { AlertModalService } from '../app/shared/alert-modal.service'

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'yuri-sushis-angular';
  @ViewChild('btnReservaConfirmada') btnReservaConfirmada: ElementRef<HTMLElement>;
  inputs = {
    nome:'',
    email:'',
    data:'',
    qtdPessoas: ''
  }
  form: FormGroup
  submitted: boolean = false;
  public modalRef: BsModalRef;

  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private geralServices: GeralService,
    private alertModal: AlertModalService) { }

  ngOnInit() {
    this.form = this.fb.group({
      nome: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      qtdPessoas: [null, [Validators.required]],
      data: [null, [Validators.required]]
    })
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  public hideModal() {
    this.modalRef.hide();
 
    // this.form.markAsPristine();
   
  }

  public formReset(){
    // TO DO tá foda fazer os errors resetarem na tela....
    // this.form.value.nome = ''
    // this.form.value.email = ''
    // this.form.value.qtdPessoas = ''
    // this.form.value.data = ''
    // this.inputs = ""
    // this.inputs.input.nome = ''
    // this.inputs.input.email = ''
    // this.inputs.input.qtdPessoas = ''
    // this.inputs.input.data = ''
   
    // Object.keys(this.form.controls).forEach(key => {
    //   this.form.get(key).setErrors(null) ;
    // });
    this.form.reset();
  }
  hasError(field: string) {
    return this.form.get(field).errors;
  }
  reservar() {
    //se tivesse um botão de cancelar, poderiamos usar o this.form.reset() para resetar o formulario
    this.submitted = true;
    // verificar se o formulário está valido para poder enviar o email de confirmação
    if (this.form.valid) {
      //monta os campos 
      var access_token = "vo7yb330kpy1b3nnwbnc52nj"
      var pessoaText = " pessoa ";
      var nome = this.form.value.nome;
      var pessoas = this.form.value.qtdPessoas;
      var data = this.form.value.data;
      var subject = "RESERVA - YURI SUSHIS"
      var reply_to = this.form.value.email;

      // verifica se são "pessoas" ou "pessoa"
      if (pessoas != "1") {
        pessoaText = " pessoas "
      }
      // monta o corpo do email
      let text = "Olá, " + nome + ". Sua reserva para " + pessoas + pessoaText + "foi feita com sucesso no dia " + data;
      // monta o body do POST
      let body = `access_token=${access_token}&reply_to=${reply_to}&subject=${subject}&text=${text}`;
      // faz a chamada do service que chama o postMail
      this.geralServices.sendEmailConfirmation(body.trim()).subscribe(
        (result: any) => {
          console.log(result)
          this.onSuccess()
        },
        (error: HttpErrorResponse) => {
          console.log(error)
          if (error.status == 200) {
            this.onSuccess()
          } else {
            this.onError()
          }
        }
      )
    }

    return false;

  }

  cardapio() {
    // TO DO
  }

 

  // toParams(data_js) {
  //   var form_data = [];
  //   for (var key in data_js) {
  //     form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
  //   }

  //   return form_data.join("&");
  // }
  onSuccess() {
    let el: HTMLElement = this.btnReservaConfirmada.nativeElement;
    el.click();
  }
  onError() {
    this.alertModal.showAlertDanger("Houve um erro inesperado, tente novamente!!")
  }
}
