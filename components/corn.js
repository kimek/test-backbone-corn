const { useState, useEffect, useRef } = React;

        const MESSAGES = {
            default: 'Buy corn',
            loading: 'Checking...',
            success: 'Success!',
            serverError: 'Error server occur. Try again later.',
            rateLimit: (errorText) => `Error: "${errorText}"`,
            clientError: (error) => `Error server occur: ${error.message}`
        };

        const REST = {
            get: '/api/buy-corn',
        };

        function Corn() {
            const [cornCount, setCornCount] = useState(0);
            const [isLoading, setIsLoading] = useState(false);
            const [message, setMessage] = useState(MESSAGES.default);
            const [cooldown, setCooldown] = useState(0);
            const intervalRef = useRef(null);

            useEffect(() => {
                if (cooldown > 0) {
                    intervalRef.current = setInterval(() => {
                        setCooldown(prev => prev - 1);
                    }, 1000);
                } else {
                    clearInterval(intervalRef.current);
                }
                
                return () => clearInterval(intervalRef.current);
            }, [cooldown]);

            const buyCorn = async () => {
                setIsLoading(true);
                setMessage(MESSAGES.loading);

                try {
                    const response = await fetch(REST.get, { method: 'POST' });
                    
                    if (response.ok) {
                        setCornCount(prev => prev + 1);
                        setMessage(MESSAGES.success);
                        setCooldown(60); 
                    } else if (response.status === 429) {
                        const errorText = await response.text();
                        setMessage(MESSAGES.rateLimit(errorText));
                        const secondsLeft = parseInt(errorText.match(/\d+/)[0] || 60, 10);
                        setCooldown(secondsLeft);
                    } else {
                        throw new Error(MESSAGES.serverError);
                    }
                } catch (error) {
                    setMessage(MESSAGES.clientError(error));
                } finally {
                    setIsLoading(false);
                }
            };
            
            const buttonDisabled = isLoading || cooldown > 0;
            let buttonText = 'Buy 1 Corn';
            if (isLoading) {
                buttonText = 'Purchasing...';
            } else if (cooldown > 0) {
                buttonText = `Wait ${cooldown}s`;
            }

            return (
                <div className="bg-yellow-300 p-8 rounded-2xl shadow-lg text-center">
                    <h1 className="text-4xl">Corn</h1>
                    <p>The freshest corn</p>
                    
                    <div className="my-8 bg-amber-100 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold">Your Corn</h2>
                        <div className="text-6xl font-bold mt-2 corn-pop" key={cornCount}>
                            {cornCount} 🌽
                        </div>
                    </div>

                    <button
                        onClick={buyCorn}
                        disabled={buttonDisabled}
                        className={`w-full text-white font-bold p-3 rounded-lg text-xl
                            ${buttonDisabled 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {buttonText}
                    </button>

                    <p className="mt-4 text-gray-600 h-10">{message}</p>
                </div>
            );
        }