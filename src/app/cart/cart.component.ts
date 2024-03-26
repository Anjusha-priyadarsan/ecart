import { Component, OnInit } from '@angular/core';
import { ProductService } from '../productService/product.service';
import { Router } from '@angular/router';
import { ToastService } from '../productService/toast.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  products:any=[]
  userId:any=""
  totalPrice:any=0

  constructor(private ps:ProductService ,private rout:Router, private tost:ToastService){}
  ngOnInit(): void {

    if(localStorage.getItem("currentUserId")){
      this.userId=localStorage.getItem("currentUserId")
      console.log(this.userId);
      
      this.getCart()
    }
  }


  getCart(){
    this.ps.getCart().subscribe({
      next:(result:any)=>{
        this.products=result
        console.log(this.products);
        this.getTotalPrice()
      }
    })
  }


  removeCart(itemId:any){
    this.ps.removeCart(itemId).subscribe({
      next:(result:any)=>{
        // alert(result)
        this.tost.showError("removed" )

        this.ps.updateCartCount()
        this.getCart()
      },
      error:(result:any)=>{
        // alert(result.error)
        this.tost.showError(result.error)

      }

    })
  }


  getTotalPrice(){
    if(this.products.length>0){
      this.totalPrice=Math.ceil(this.products.map((i:any)=>i.grantTotal).reduce((a:any,b:any)=>a+b))
      // console.log(this.totalPrice);
      
    }
  }

  increment(id:any){
    this.ps.incrementCart(id).subscribe({
      next:(result:any)=>{
        this.getCart()
      }
    })
  }

  decrement(id:any){
    this.ps.decrementCart(id).subscribe({
      next:(result:any)=>{
        this.getCart()
        this.ps.updateCartCount()
      }
    })
  }

  checkOut(){
    localStorage.setItem("total",this.totalPrice)

    this.rout.navigateByUrl('/checkout')

  }


}
