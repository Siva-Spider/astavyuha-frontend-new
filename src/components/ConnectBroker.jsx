import { useState } from 'react';

const ConnectBroker = ({ brokerCount, selectedBrokers, onBrokerCountChange, onBrokerChange, onCredentialChange, onConnect }) => {
    const broker_map = {
        "u": "Upstox",
        "z": "Zerodha",
        "a": "AngelOne",
        "g": "Groww",
        "5": "5paisa"
    };

    const getCredentialsFields = (brokerName, index) => {
        const credentials = [];
        if (brokerName === "Upstox") {
            credentials.push({ name: 'access_token', label: 'Access Token' });
        } else if (brokerName === "Zerodha") {
            credentials.push({ name: 'api_key', label: 'API Key' }, { name: 'access_token', label: 'Access Token' });
        } else if (brokerName === "AngelOne") {
            credentials.push(
                { name: 'api_key', label: 'API Key' },
                { name: 'user_id', label: 'User ID' },
                { name: 'pin', label: 'PIN' },
                { name: 'totp_secret', label: 'TOTP Secret' }
            );
        }else if (brokerName === "5paisa") {
            credentials.push(
                { name: 'app_key', label: 'APP Key' },
                { name: 'client_id', label: 'Client ID' },
                { name: 'access_token', label: 'Access Token' }
            );
        } else if (brokerName === "Groww") {
            credentials.push({ name: 'access_token', label: 'Access Token' });
        }
        
        return credentials.map(field => (
            <div key={field.name} style={{ marginRight: '10px' }}>
                <label>
                    {field.label}:
                    <input 
                        type="text" 
                        value={selectedBrokers[index].credentials[field.name] || ''}
                        onChange={(e) => onCredentialChange(e, index, field.name)} 
                        style={{ marginLeft: '5px' }}
                    />
                </label>
            </div>
        ));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Connect to Broker</h2>
            <form onSubmit={onConnect}>
                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Number of Brokers (1-5):
                        <input 
                            type="number" 
                            min="1" 
                            max="5" 
                            value={brokerCount} 
                            onChange={onBrokerCountChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                </div>
                
                {Array.from({ length: brokerCount }).map((_, index) => {
                    const selectedBrokerName = broker_map[selectedBrokers[index].name];
                    const profile = selectedBrokers[index].profileData;
                    return (
                        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                            <div style={{ marginRight: '10px' }}>
                                <label>
                                    Broker {index + 1}:
                                    <select 
                                        value={selectedBrokers[index].name}
                                        onChange={(e) => onBrokerChange(e, index)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        {Object.entries(broker_map).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            {getCredentialsFields(selectedBrokerName, index)}
                            {profile && (
                                <div style={{ marginLeft: '20px', paddingLeft: '20px', borderLeft: '1px solid #ddd' }}>
                                    {profile.status === 'success' ? (
                                        <>
                                            <p style={{ margin: '0' }}>✅ **Connected**</p>
                                            <p style={{ margin: '0' }}>User: {profile.profile['User Name']}</p>
                                            <p style={{ margin: '0' }}>Balance: ₹{profile.balance['Available Margin']}</p>
                                        </>
                                    ) : (
                                        <p style={{ margin: '0', color: 'red' }}>❌ {profile.message}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                <button type="submit" style={{ marginTop: '20px' }}>Connect</button>
            </form>
        </div>
    );
};

export default ConnectBroker;