import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../productService/product.service';
import { Router } from '@angular/router';
import { ToastService } from '../productService/toast.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  

  loginFormModel=this.fb.group({
    email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
    pwd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]+')]]
  })

constructor(private fb:FormBuilder,private ps:ProductService, private route:Router,private tost:ToastService){}

  ngOnInit(): void {
  }

  login(){
    

   if(this.loginFormModel.valid){

        var path=this.loginFormModel.value

        var loginData={
          email:path.email,
          password:path.pwd

        }



    this.ps.signIn(loginData).subscribe({
      next:(res:any)=>{
        console.log(res);
        // alert(`${res.user.username} login successfully`)
        this.tost.showSuccess(`${res.user.username} login successfully`)

        this.loginFormModel.reset()
        localStorage.setItem("currentUser",res.user.username)
        localStorage.setItem("currentUserId",res.user._id)


        // store token in localstorage
        localStorage.setItem("token",res.token)




        this.route.navigateByUrl("")
        
        

      },
      error:(res:any)=>{
        console.log(res);
        // alert(res.error)
        this.tost.showError(`${res.error} `)


      }
    })
   }
   else{
    // alert('inavalid form')
    this.tost.showError("Invalid Form")

   }
     
   
    
  }
  

}
