import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ProductService } from '../productService/product.service';
import { ToastService } from '../productService/toast.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;

  buyStatus: any = false
  totalPrice: any = ""
  id:any=""

  checkOut = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
    address: ['', [Validators.required]],
    place: ['', [Validators.required]],

    pin: ['', [Validators.required, Validators.pattern('[0-9]+')]]
  })

  constructor(private fb: FormBuilder, private rout: Router, private ps:ProductService,private tost:ToastService) { }
  ngOnInit(): void {

    this.totalPrice = localStorage.getItem("total")
    this.id=localStorage.getItem("currentUserId")

  }


  cancel() {

    this.rout.navigateByUrl("/cart")

  }

  proceedToBuy() {
    if (this.checkOut.valid) {

      this.buyStatus = true
    }

  }

  cancelPayment() {
    this.buyStatus = false
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.totalPrice,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.totalPrice
              }
            }
          },

        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;
        // empty Cart
        this.ps.deleteCart(this.id).subscribe({
          next:(result:any)=>{
            // alert(result)
            this.tost.showSuccess(`${result} `)

            
          }
        })
        // redirect to home
        this.rout.navigateByUrl("")
        // cart count update

        
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;
        // alert("Transaction has been cancelled")
        this.tost.showWarning("Transaction has been cancelled")


      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
        // alert("transaction failed , try after some time")
        this.tost.showError("transaction failed , try after some time")

      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      }
    };
  }

  payment(){
    this.initConfig()

  }
}






