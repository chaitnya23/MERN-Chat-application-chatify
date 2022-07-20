import React from 'react'
import dpImg from '../profile.jpeg'

export default function Profile({showDp ,exitProfile ,name,email ,imgSrc}) {
  

    return (
        <>
          <div className={`   profile-area d-${showDp}`}>
            <div className="row dp-row justify-content-center">
                <div className="dp-box col-5">
                <div className="row cancel-box justify-content-end ">
                  <button className='btn' onClick={exitProfile} >X</button>
                </div>
                    <div className="row dp-img-box mt-3">
                      <img src={imgSrc} className='mx-auto mt-1' alt="" />
                    </div>
                    <div className="row user-details-box mt-4">
                      <h4 className='text-center mt-1'>{name}</h4>
                      <h5 className='text-center mt-2'>{email}</h5>
                    </div>
                </div>
            </div>
          </div>   
        </>
    )
}

