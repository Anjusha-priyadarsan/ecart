import { Component, OnInit } from '@angular/core';
import { ProductService } from '../productService/product.service';
import { Router } from '@angular/router';
import { ToastService } from '../productService/toast.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  userId:any=""
  products:any=[]

  constructor(private ps:ProductService ,private rou:Router,private tost:ToastService){}
  ngOnInit(): void {
    if(localStorage.getItem("currentUserId")){
      this.userId=localStorage.getItem("currentUserId")
      console.log(this.userId);
      
      this.getWishlist()
    }

  }

  getWishlist(){
    this.ps.getWishlist(this.userId).subscribe({
      next:(result:any)=>{
        this.products=result
        console.log(this.products);
        
      }
    })
  }

  removeWishlist(itemId:any){
    this.ps.removeWishlist(itemId).subscribe({
      next:(result:any)=>{
        // alert(result)
        this.tost.showError(`${result}`)

        
        this.getWishlist()
      },
      error:(result:any)=>{
        alert(result.error)
      }

    })
  }

  addtoCart(product:any){
      // alert("added to cart")
      Object.assign(product,{quantity:1})
      console.log(product);
      this.ps.addToCart(product).subscribe({
        next:(result:any)=>{
          this.ps.updateCartCount()
          this.removeWishlist(product._id)

          // alert(result)
          this.tost.showSuccess(`${result}`)

        },
        error:(result:any)=>{
          alert(result.error)
        }
      })
      
    

  }

}
