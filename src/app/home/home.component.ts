import { Component, OnInit } from '@angular/core';
import { ProductService } from '../productService/product.service';
import { Router } from '@angular/router';
import { ToastService } from '../productService/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit{

  allProducts:any=[]
  searchData=""

  constructor(private ps:ProductService,private rou:Router,private tost:ToastService){}

  ngOnInit(): void {

    this.ps.searchString.subscribe((data:any)=>{
      this.searchData=data
      console.log( this.searchData);
      

      this.ps.getAllProducts(this.searchData).subscribe({
        next:(result:any)=>{
          this.allProducts=result
          
  
        },
        error:(result:any)=>{
          this.tost.showError(`${result} `)
        }
      })
    })

    
  }
  isLoggedIn(){
    if(localStorage.getItem("currentUser")){
      return true
    }
    else{
      return false
    }
  }

  addtoCart(product:any){
    if(this.isLoggedIn()){
      // alert("added to cart")
      Object.assign(product,{quantity:1})
      console.log(product);
      this.ps.addToCart(product).subscribe({
        next:(result:any)=>{
          // alert(result)
          this.tost.showSuccess(`${result} `)

          this.ps.updateCartCount()
        },
        error:(result:any)=>{
          // alert(result.error)
          this.tost.showError(`${result.error} `)

        }
      })
      
    }
    else{
      // alert("plaese login first")
      this.tost.showWarning("plaese login First")

      this.rou.navigateByUrl("login")
    }

  }
  addtoWish(id:any,title:any,price:any,description:any,category:any,image:any,rating:any){
    // console.log(id,title,price,description,category,image,rating);
    
    if(this.isLoggedIn()){
      if(localStorage.getItem("currentUserId")){
        var userId=localStorage.getItem("currentUserId")
        const bodyData={
          userId,id,title,price,description,category,image,rating
        }
        console.log(bodyData);
        
        this.ps.addToWishlist(bodyData).subscribe({
          next:(result:any)=>{
            // alert(result)
            this.tost.showSuccess(`${result}`)

            

          },
          error:(result:any)=>{
            // alert(result.error)
            this.tost.showError(`${result.error} `)

            
            console.log(result.error);
            // alert("Failed to add to wishlist. Error: " +result. error.message);
            // console.log("Error adding to wishlist:", result.error);
            

          }
        })
      }
    }
    else{
      // alert("plaese login first")
      this.tost.showWarning("plaese login First")

      this.rou.navigateByUrl("login")
    }


  }

}
