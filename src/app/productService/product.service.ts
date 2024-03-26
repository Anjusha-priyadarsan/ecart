import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  BaseUrl="http://localhost:8000"

  searchString= new BehaviorSubject("")
  cartCount= new BehaviorSubject(0)


  constructor(private http:HttpClient) {
    this.updateCartCount()
   }


  updateCartCount(){
    this.getCart().subscribe({
      next:(result:any)=>{
        // next function is used to update value of behavioural subject
        this.cartCount.next(result.length)
      }
    })
  }

  // api call to get all products

  getAllProducts(searchData:any){
    // ?search  -- query parameter
   return this.http.get(`${this.BaseUrl}/get-all-products?search=${searchData}`)
  }
  getSingleProduct(id:any){
    return this.http.get(`${this.BaseUrl}/single-product/${id}`)
   }

   signUp(bodyData:any){
    return this.http.post(`${this.BaseUrl}/addd-new-user`,bodyData)

   }

   signIn(bodyData:any){
    return this.http.post(`${this.BaseUrl}/login`,bodyData)

   }

   accessTokenHeader(){
    var headers=new HttpHeaders()
    if(localStorage.getItem("token")){
      const token=localStorage.getItem("token")
      var headers=headers.append('access_token',`Bearer ${token}`)
    }
    return {headers}
   }

   addToWishlist(bodyData:any){
    return this.http.post(`${this.BaseUrl}/user/add-to-wishlist`,bodyData,this.accessTokenHeader())

   }

   getWishlist(userId:any){
    return this.http.get(`${this.BaseUrl}/user/get-wishlist/${userId}`,this.accessTokenHeader())
   }

   removeWishlist(itemId:any){
    return this.http.delete(`${this.BaseUrl}/user/delete-wishlist-item/${itemId}`,this.accessTokenHeader())
   }

   addToCart(bodyData:any){
    return this.http.post(`${this.BaseUrl}/user/add-to-cart`,bodyData,this.accessTokenHeader())

   }

   getCart(){
    return this.http.get(`${this.BaseUrl}/user/get-cart`,this.accessTokenHeader())
   }

   removeCart(itemId:any){
    return this.http.delete(`${this.BaseUrl}/user/delete-cart-item/${itemId}`,this.accessTokenHeader())
   }

   incrementCart(id:any){
    return this.http.get(`${this.BaseUrl}/user/increment-cart/${id}`,this.accessTokenHeader())
   }

   decrementCart(id:any){
    return this.http.get(`${this.BaseUrl}/user/decrement-cart/${id}`,this.accessTokenHeader())
   }

   deleteCart(id:any){
    return this.http.delete(`${this.BaseUrl}/user/empty-cart/${id}`,this.accessTokenHeader())
   }

}
