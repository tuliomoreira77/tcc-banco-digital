import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthServiceService } from '../auth/auth-service.service';
import * as CONFIG from '../CONFIG';

@Component({
  selector: 'app-user-main-screen',
  templateUrl: './user-main-screen.component.html',
  styleUrls: ['./user-main-screen.component.scss']
})
export class UserMainScreenComponent implements OnInit {

  showInvestimentoModal_ = false;
  showDepositModal_ = false;
  formRegister = this.fb.group({
    valorDeposito: ['', [Validators.required]],
  });


  tiposFundo = [
    {
      nome:"Poupança",
      sigla: "POU"
    },{
      nome: "Tesouro Direto",
      sigla: "TDI"
    }, {
      nome: "LCI",
      sigla: "LCI"
    },{
      nome: "LCA",
      sigla: "LCA"
  }]
  investimentoformRegister = this.fb.group({
    tipoFundo: ['', [Validators.required]],
    valorAplicacao: ['', [Validators.required]],
  });

  
  user = {primeiroNome: ''};
  contaCorrenteInfo = {
    saldo: 0,
    montanteFaturaAtual: 0
  };

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  single = [];

  constructor(
    private fb: FormBuilder,
    private authService:AuthServiceService,
    private http:HttpClient,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getContaCorrenteInfo();
    this.getUser();
    this.getInvestimentos();
  }

  async getContaCorrenteInfo() {
    this.spinner.show();
    this.contaCorrenteInfo = await this.http.get<any>(CONFIG.CONTA_CORRENTE_URL).toPromise();
    this.spinner.hide();
  }

  async getUser() {
    this.spinner.show();
    this.user = await this.authService.getUser();
    this.spinner.hide();
  }

  getTiposFundos() {
    return this.tiposFundo;
  }

  getDepositModal() {
    return this.showDepositModal_;
  }


  onClickDepositButtom() {
    this.showDepositModal_ = true;
  }

  onCloseDepositModal() {
    this.showDepositModal_ = false;
    this.formRegister.reset();
  }

  getInvestimentoModal() {
    return this.showInvestimentoModal_;
  }

  onClickInvestimentoModal() {
    this.showInvestimentoModal_ = true;
  }

  onCloseInvestimentoModal() {
    this.showInvestimentoModal_ = false;
    this.investimentoformRegister.reset();
  }

  async onClickSendDeposit() {
    this.spinner.show();
    let value = this.formRegister.value;
    let valorDeposito = value.valorDeposito.toString().replace(/\D/g,'')
    let response = await this.http.get<any>(`${CONFIG.DEPOSITO_URL}/${valorDeposito}`).toPromise();

    let boleto = window.open("", "_blank");
    boleto.document.write(response.html);
    this.getContaCorrenteInfo();
    this.onCloseDepositModal();
  }

  async onClickSendInvestimento() {
    this.spinner.show();
    let value = this.investimentoformRegister.value;
    let valorAplicacao = +value.valorAplicacao.toString().replace(/\D/g,'')/100;
    let response = await this.http.post<any>(`${CONFIG.INVESTIMENTO_URL}`, {
      montante: valorAplicacao,
      fundo: value.tipoFundo
    }).toPromise();
    this.getContaCorrenteInfo();
    this.getInvestimentos();
    this.onCloseInvestimentoModal();
  }

  async getInvestimentos() {
    let investimentos = await this.http.get<any>(CONFIG.INVESTIMENTO_URL).toPromise();
    this.single = investimentos.map(element => {
      return {
        name: element.fundo,
        value: element.montante
      }
    });
  }

}
