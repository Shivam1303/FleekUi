# MultiStepForm Usage Example

To use the `MultiStepForm` component in your React project, follow this example: 

```tsx
import React from "react";
import { MultiStepForm } from "@sliderzz/fleek-multistepform";

const App: React.FC = () => {
    const handleFinalSubmit = () => {
        alert("Form submitted successfully!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
            <div className="w-full bg-gray-800 p-8 rounded-lg shadow-lg text-white">
                <MultiStepForm onSubmit={handleFinalSubmit} formClassName="space-y-6" stepIndicatorClassName="flex justify-center space-x-3 mb-6" buttonClassName="px-5 py-2 font-medium">
                    {/* Step 1: Personal Details */}
                    <div className="space-y-4 w-[1000px] h-[400px]">
                        <h2 className="text-2xl font-semibold">Step 1: Personal Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="First Name" className="w-full border border-gray-600 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-blue-500" />
                            <input type="text" placeholder="Last Name" className="w-full border border-gray-600 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Step 2: Contact Information */}
                    <div className="space-y-4 w-[1000px] h-[400px]">
                        <h2 className="text-2xl font-semibold">Step 2: Contact Information</h2>
                        <input type="email" placeholder="Email" className="w-full border border-gray-600 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-blue-500" />
                        <input type="tel" placeholder="Phone Number" className="w-full border border-gray-600 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring focus:ring-blue-500" />
                    </div>

                    {/* Step 3: Confirmation */}
                    <div className="text-center w-[1000px] h-[400px]">
                        <h2 className="text-2xl font-semibold">Step 3: Confirmation</h2>
                        <p className="text-gray-400 mt-4">Please review your details before submitting.</p>
                    </div>
                </MultiStepForm>
            </div>
        </div>
    );
};

export default App;
```
Like this anyone can use multistep form as an wrapper and create as many steps as needed.
Try it out, Thank you!
