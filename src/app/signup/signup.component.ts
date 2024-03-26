import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../productService/product.service';
import { Router } from '@angular/router';
import { ToastService } from '../productService/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupFormModel=this.fb.group({
    username:['',[Validators.required]],
    email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
    pwd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]+')]]
  })

  constructor(private fb:FormBuilder,private ps:ProductService,private rout:Router,private tost:ToastService){}
  ngOnInit(): void {
  }
  signup(){

    if(this.signupFormModel.valid){

      var path=this.signupFormModel.value

      var userData={
            username:path.username,
            email:path.email,
            password:path.pwd
      }
      this.ps.signUp(userData).subscribe({
        next:(res:any)=>{
          console.log(res);
          // alert(`${res.username} registered successfully`)
          this.tost.showSuccess(`${res.username}registered successfully `)

          this.signupFormModel.reset()
          this.rout.navigateByUrl('/login')
          
          

        },
        error:(res:any)=>{
          console.log(res);
          // alert(res.error)
          this.tost.showSuccess(`${res.error} `)


        }
      })

    }
    else{
      // alert('invalid form')
      this.tost.showError("Invalid Form")


    }

    
    

  }

}
