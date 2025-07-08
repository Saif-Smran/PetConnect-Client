import React from 'react';

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="card-pet p-8">
                    <div className="text-center mb-8">
                        <h1 className="font-secondary font-bold text-3xl mb-2">
                            Welcome Back!
                        </h1>
                        <p className="font-primary opacity-70">
                            Sign in to your PetConnect account
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="text-6xl mb-6 animate-bounce-gentle">🔐</div>
                        <h2 className="font-secondary font-semibold text-2xl mb-4">
                            Login Page Coming Soon!
                        </h2>
                        <p className="font-primary opacity-70">
                            We're building a secure and user-friendly login experience for you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
