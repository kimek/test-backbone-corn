const { useState, useEffect, useRef } = React;

const api = {
    buyCorn: async () => {
        const response = await fetch('/api/buy-corn', { method: 'POST' });

        if (response.ok) {
            return { success: true };
        }

        if (response.status === 429) {
            const errorText = await response.text();
            const secondsLeft = parseInt(errorText.match(/\d+/)[0] || 60, 10);
            return { success: false, error: errorText, cooldown: secondsLeft };
        }
        throw new Error('The farmer is busy. Try again later.');
    }
};

const CornDisplay = ({ count }) => (
    <div className="my-8 bg-amber-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold">Your Corn</h2>
        <div className="text-6xl font-bold mt-2 corn-pop" key={count}>
            {count} 🌽
        </div>
    </div>
);

const PurchaseButton = ({ onClick, disabled, text }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-white font-bold p-3 rounded-lg text-xl transition-colors
            ${disabled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
    >
        {text}
    </button>
);

const StatusMessage = ({ message }) => (
    <p className="mt-4 text-gray-600 h-10">{message}</p>
);

function Corn() {
    const [cornCount, setCornCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('Buy corn');
    const [cooldown, setCooldown] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (cooldown > 0) {
            intervalRef.current = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        } else if (cooldown === 0 && message.includes('Wait')) {
            setMessage('Ready to buy more corn!');
        }
        return () => clearInterval(intervalRef.current);
    }, [cooldown, message]);

    const handleBuyCorn = async () => {
        setIsLoading(true);
        setMessage('Checking...');

        try {
            const result = await api.buyCorn();
            if (result.success) {
                setCornCount(prev => prev + 1);
                setMessage('Success!');
                setCooldown(60);
            } else {
                setMessage(`Error: "${result.error}"`);
                setCooldown(result.cooldown);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
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
        <div className="bg-yellow-300 p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
            <h1 className="text-4xl">Corn</h1>
            <p>The freshest corn</p>
            
            <CornDisplay count={cornCount} />
            
            <PurchaseButton onClick={handleBuyCorn} disabled={buttonDisabled} text={buttonText} />

            <StatusMessage message={message} />
        </div>
    );
}