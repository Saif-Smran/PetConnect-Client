import React from 'react';

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="card-pet p-8">
                    <div className="text-center mb-8">
                        <h1 className="font-secondary font-bold text-3xl mb-2">
                            Join PetConnect!
                        </h1>
                        <p className="font-primary opacity-70">
                            Create your account and start connecting with amazing pets
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-6xl mb-6 animate-bounce-gentle">📝</div>
                        <h2 className="font-secondary font-semibold text-2xl mb-4">
                            Registration Coming Soon!
                        </h2>
                        <p className="font-primary opacity-70">
                            We're creating an easy and secure registration process for new members.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
