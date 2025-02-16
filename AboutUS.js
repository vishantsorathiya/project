import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AboutUS() {
  return (
    <div>
        <div><Navbar/></div>
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-8 offset-md-2">
                    <h1 className="text-center mb-4">About Us</h1>
                    <p>
                        Welcome to our restaurant! At [Restaurant Name], we pride ourselves on serving delicious meals made from fresh, locally sourced ingredients. 
                        Our chefs are passionate about creating mouthwatering dishes that will tantalize your taste buds.
                    </p>
                    <p>
                        Whether you're craving a hearty burger, a refreshing salad, or a decadent dessert, we have something to satisfy every appetite. 
                        Our menu features a diverse selection of options, including vegetarian and gluten-free choices, ensuring there's something for everyone.
                    </p>
                    <p>
                        In addition to our delicious food, we strive to provide a warm and inviting atmosphere for our guests. 
                        Our friendly staff is dedicated to ensuring you have an exceptional dining experience from the moment you walk through our doors.
                    </p>
                    <p>
                        Thank you for choosing [Restaurant Name]. We look forward to serving you soon!
                    </p>
                </div>
            </div>
        </div>
        <div><Footer/></div>
    </div>
  )
}
