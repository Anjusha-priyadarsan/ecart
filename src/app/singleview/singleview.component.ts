import { Component, OnInit } from '@angular/core';
import { ProductService } from '../productService/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../productService/toast.service';

@Component({
  selector: 'app-singleview',
  templateUrl: './singleview.component.html',
  styleUrls: ['./singleview.component.css']
})
export class SingleviewComponent implements OnInit {

  id: any = ""
  singleProduct: any = {}
  constructor(private ps: ProductService, private ar: ActivatedRoute ,private rou:Router, private tost:ToastService) { }
  ngOnInit(): void {

    this.ar.params.subscribe((data: any) => {
      this.id = data.id
      this.ps.getSingleProduct(this.id).subscribe({
        next: (result: any) => {
          this.singleProduct = result
          console.log(this.singleProduct);

        },
        error: (result: any) => {
          alert(result.error.message)

        }
      })


    })







  }

  addtoCart(product:any){
    if(localStorage.getItem("currentUserId")){
      // alert("added to cart")
      Object.assign(product,{quantity:1})
      console.log(product);
      this.ps.addToCart(product).subscribe({
        next:(result:any)=>{
          // alert(result)
          this.tost.showSuccess(`${result}`)

          this.ps.updateCartCount()
        },
        error:(result:any)=>{
          // alert(result.error)
          this.tost.showSuccess(`${result.error} `)

        }
      })
      
    }
    else{
      alert("plaese login first")
      this.rou.navigateByUrl("login")
    }

  }


  addtoWish(id:any,title:any,price:any,description:any,category:any,image:any,rating:any){
    // console.log(id,title,price,description,category,image,rating);
    
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
            alert(result.error)
            console.log(result.error);
            // alert("Failed to add to wishlist. Error: " +result. error.message);
            // console.log("Error adding to wishlist:", result.error);
            

          }
        })
      }
    
    else{
      // alert("plaese login first")
      this.tost.showWarning("plaese login first")

      this.rou.navigateByUrl("login")
    }


  }


}



