import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';


@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  };
  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService) { }

  ngOnInit() {
  }

  onSubmit(form) {
    console.log(form);

    // console.log(this.usuario)

    //enderecoServer/formUsuario é um endereço falso criado para simularar um envio de dados ao servidor
    //Foi substituído por um Web service
    this.http.post('https://httpbin.org/post', JSON.stringify(form.value))
      .subscribe(dados => console.log(dados));
  }

  verificaValidTouched(campo){
    return !campo.valid && campo.touched
  }


  aplicaCssErro(campo){
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }

  }

  consultaCEP(cep, form){
    console.log(cep)

    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
			this.cepService.consultaCEP(cep)
			.subscribe(dados => this.populaDadosForm(dados, form));
		}

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if(validacep.test(cep)) {

        this.resetaDadosForm(form);

        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
          //.map(dados => dados.json())
          .subscribe(dados => this.populaDadosForm(dados, form));

      }
    }

  }

populaDadosForm(dados, formulario){
  /*formulario.setValue({
    nome: formulario.value.nome,
    email: formulario.value.email,
    endereco: {
      rua: dados.logradouro,
      cep: dados.cep,
      numero: '',
      complemento: dados.complemento,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf
  }

  });*/

  formulario.form.patchValue({
    endereco: {
      rua: dados.logradouro,
      //cep: dados.cep,
      complemento: dados.complemento,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf
    }
  });
}


resetaDadosForm(formulario){
  formulario.form.patchValue({
    endereco: {
      rua: null,
      complemento: null,
      bairro: null,
      cidade: null,
      estado: null
    }
  });
}



}
