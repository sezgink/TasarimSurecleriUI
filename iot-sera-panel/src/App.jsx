import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Thermometer, 
  Droplet, 
  Power, 
  Settings, 
  History, 
  ChevronRight,
  CircleDot,
  ZapOff,
  CloudDrizzle,
  Sun,
  Clock,
  Building // Sera ikonu için
} from 'lucide-react';

// --- Başlangıç Veri Simülasyonu ---

// Geçmiş verileri için yardımcı fonksiyon
const createTimestamp = (date = new Date()) => date.toLocaleString('tr-TR');

// 10 bitki / 3 sera
const initialDevices = {
  // Sera A
  'sera-a-1': {
    id: 'sera-a-1',
    name: 'Sera A - Bitki 1',
    status: 'online',
    sensors: { temperature: 22.5, humidity: 45 },
    controls: { lightIntensity: 70 },
    automation: {
      enabled: true,
      minHumidity: 40,
      baseWaterAmount: 100, // YENİ: mL cinsinden
      lightStartTime: '08:00',
      lightEndTime: '22:00',
    },
    history: {
      sensorLog: [{ timestamp: createTimestamp(new Date(Date.now() - 3600000)), temperature: 22.1, humidity: 48 }],
      wateringLog: [{ timestamp: createTimestamp(new Date(Date.now() - 10800000)), action: 'Manuel Sulama', amount: '150mL' }],
    },
  },
  'sera-a-2': {
    id: 'sera-a-2',
    name: 'Sera A - Bitki 2',
    status: 'online',
    sensors: { temperature: 23.0, humidity: 50 },
    controls: { lightIntensity: 70 },
    automation: { enabled: true, minHumidity: 45, baseWaterAmount: 100, lightStartTime: '08:00', lightEndTime: '22:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-a-3': {
    id: 'sera-a-3',
    name: 'Sera A - Bitki 3 (Çevrimdışı)',
    status: 'offline',
    sensors: { temperature: 0, humidity: 0 },
    controls: { lightIntensity: 0 },
    automation: { enabled: false, minHumidity: 40, baseWaterAmount: 100, lightStartTime: '08:00', lightEndTime: '22:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
  // Sera B
  'sera-b-1': {
    id: 'sera-b-1',
    name: 'Sera B - Bitki 1',
    status: 'online',
    sensors: { temperature: 26.1, humidity: 55 },
    controls: { lightIntensity: 85 },
    automation: { enabled: true, minHumidity: 50, baseWaterAmount: 120, lightStartTime: '07:30', lightEndTime: '21:30' },
    history: {
      sensorLog: [{ timestamp: createTimestamp(new Date(Date.now() - 4000000)), temperature: 23.8, humidity: 58 }],
      wateringLog: [{ timestamp: createTimestamp(new Date(Date.now() - 12000000)), action: 'Otomatik Sulama', amount: '120mL' }],
    },
  },
  'sera-b-2': {
    id: 'sera-b-2',
    name: 'Sera B - Bitki 2',
    status: 'online',
    sensors: { temperature: 25.8, humidity: 52 },
    controls: { lightIntensity: 85 },
    automation: { enabled: true, minHumidity: 50, baseWaterAmount: 120, lightStartTime: '07:30', lightEndTime: '21:30' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-b-3': {
    id: 'sera-b-3',
    name: 'Sera B - Bitki 3',
    status: 'online',
    sensors: { temperature: 26.3, humidity: 54 },
    controls: { lightIntensity: 85 },
    automation: { enabled: true, minHumidity: 50, baseWaterAmount: 120, lightStartTime: '07:30', lightEndTime: '21:30' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-b-4': {
    id: 'sera-b-4',
    name: 'Sera B - Bitki 4',
    status: 'online',
    sensors: { temperature: 26.0, humidity: 53 },
    controls: { lightIntensity: 85 },
    automation: { enabled: true, minHumidity: 50, baseWaterAmount: 120, lightStartTime: '07:30', lightEndTime: '21:30' },
    history: { sensorLog: [], wateringLog: [] },
  },
  // Sera C
  'sera-c-1': {
    id: 'sera-c-1',
    name: 'Sera C - Bitki 1',
    status: 'online',
    sensors: { temperature: 24.5, humidity: 60 },
    controls: { lightIntensity: 80 },
    automation: { enabled: true, minHumidity: 55, baseWaterAmount: 110, lightStartTime: '08:00', lightEndTime: '21:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-c-2': {
    id: 'sera-c-2',
    name: 'Sera C - Bitki 2',
    status: 'online',
    sensors: { temperature: 24.7, humidity: 62 },
    controls: { lightIntensity: 80 },
    automation: { enabled: true, minHumidity: 55, baseWaterAmount: 110, lightStartTime: '08:00', lightEndTime: '21:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
  'sera-c-3': {
    id: 'sera-c-3',
    name: 'Sera C - Bitki 3',
    status: 'online',
    sensors: { temperature: 24.6, humidity: 61 },
    controls: { lightIntensity: 80 },
    automation: { enabled: true, minHumidity: 55, baseWaterAmount: 110, lightStartTime: '08:00', lightEndTime: '21:00' },
    history: { sensorLog: [], wateringLog: [] },
  },
};

// --- Ana Uygulama Bileşeni ---
export default function App() {
  const [allDevices, setAllDevices] = useState(initialDevices);
  const [selectedSera, setSelectedSera] = useState('Sera A'); // YENİ: Sera seçimi
  const [selectedDeviceId, setSelectedDeviceId] = useState('sera-a-1'); // Varsayılan
  
  // --- Yardımcı Veri Çıkarımları ---
  const seraNames = [...new Set(Object.values(allDevices).map(d => d.name.split(' - ')[0]))].sort();
  const devicesInSelectedSera = Object.values(allDevices).filter(d => d.name.startsWith(selectedSera));
  const selectedDevice = allDevices[selectedDeviceId];

  // --- Veri Simülasyonu Motoru ---
  useEffect(() => {
    const interval = setInterval(() => {
      setAllDevices(currentDevices => {
        const newDevices = { ...currentDevices };

        // Her cihazı güncelle
        Object.keys(newDevices).forEach(id => {
          const device = { ...newDevices[id] };
          
          if (device.status === 'offline') return;

          // 1. Sensör verilerini simüle et
          const newTemp = parseFloat((device.sensors.temperature + (Math.random() - 0.5) * 0.2).toFixed(1));
          const newHumid = parseFloat((device.sensors.humidity + (Math.random() - 0.5) * 0.5).toFixed(0));
          device.sensors = { temperature: newTemp, humidity: newHumid };

          // 2. Sensör geçmişine ekle
          const newSensorLogEntry = { timestamp: createTimestamp(), temperature: newTemp, humidity: newHumid };
          device.history = { ...device.history }; 
          device.history.sensorLog = [newSensorLogEntry, ...device.history.sensorLog.slice(0, 19)];

          // 3. Otomasyonu kontrol et (Maksimum sıcaklık kontrolü KALDIRILDI)
          if (
            device.automation.enabled &&
            device.sensors.humidity < device.automation.minHumidity
          ) {
            // --- Sıcaklığa Göre Sulama MİKTARI Formülasyonu ---
            const baseAmount = device.automation.baseWaterAmount || 100;
            // Sıcaklık 25'in üzerindeyse, her derece için 10mL daha fazla ver (Örnek formül)
            const tempBonus = device.sensors.temperature > 25 
                              ? Math.floor(device.sensors.temperature - 25) * 10
                              : 0;
            const finalAmount = baseAmount + tempBonus;
            // --- Formülasyon Sonu ---

            const newWaterLogEntry = { 
              timestamp: createTimestamp(), 
              action: 'Otomatik Sulama', 
              amount: `${finalAmount}mL` // Hesaplanan miktar
            };
            device.history.wateringLog = [newWaterLogEntry, ...device.history.wateringLog.slice(0, 19)];
            
            // Nemi artır
            device.sensors.humidity = device.sensors.humidity + 15;
          }
          
          newDevices[id] = device;
        });

        return newDevices;
      });
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);
  // --- Simülasyon Sonu ---

  // --- Eylem Yöneticileri (Event Handlers) ---

  const handleManualWater = (deviceId) => {
    setAllDevices(prevDevices => {
      const newDevices = { ...prevDevices };
      const device = { ...newDevices[deviceId] };
      
      const newWaterLogEntry = { timestamp: createTimestamp(), action: 'Manuel Sulama', amount: '150mL' }; // Sabit miktar
      device.history = { ...device.history };
      device.history.wateringLog = [newWaterLogEntry, ...device.history.wateringLog.slice(0, 19)];
      device.sensors = { ...device.sensors, humidity: device.sensors.humidity + 20 };
      
      newDevices[deviceId] = device;
      return newDevices;
    });
  };

  const handleLightIntensityChange = (deviceId, intensity) => {
    setAllDevices(prevDevices => {
      const newDevices = { ...prevDevices };
      const device = { ...newDevices[deviceId] };
      device.controls = { ...device.controls, lightIntensity: parseInt(intensity, 10) };
      newDevices[deviceId] = device;
      return newDevices;
    });
  };
  
  const handleAutomationUpdate = (deviceId, newAutomationSettings) => {
     setAllDevices(prevDevices => {
      const newDevices = { ...prevDevices };
      const device = { ...newDevices[deviceId] };
      device.automation = newAutomationSettings;
      newDevices[deviceId] = device;
      return newDevices;
    });
  };

  // Sera seçimi değiştiğinde
  const handleSeraSelect = (seraName) => {
    setSelectedSera(seraName);
    // O seradaki ilk cihazı otomatik seç
    const firstDeviceOfSera = Object.values(allDevices).find(d => d.name.startsWith(seraName));
    if (firstDeviceOfSera) {
      setSelectedDeviceId(firstDeviceOfSera.id);
    }
  };


  return (
    <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sol Gezinme (Seralar) */}
      <SeraNavigator
        seraNames={seraNames}
        selectedSera={selectedSera}
        onSelectSera={handleSeraSelect}
      />
      
      {/* Orta Panel (Bitkiler/Cihazlar) */}
      <DeviceSelector
        devices={devicesInSelectedSera}
        selectedDeviceId={selectedDeviceId}
        onSelectDevice={setSelectedDeviceId}
      />
      
      {/* Ana İçerik Alanı (Dashboard) */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {selectedDevice ? (
          <Dashboard
            key={selectedDevice.id} 
            device={selectedDevice}
            onManualWater={() => handleManualWater(selectedDevice.id)}
            onLightIntensityChange={(intensity) => handleLightIntensityChange(selectedDevice.id, intensity)}
            onAutomationUpdate={(settings) => handleAutomationUpdate(selectedDevice.id, settings)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl text-gray-500">Lütfen yönetmek için bir sera ve bitki seçin.</h2>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Yeni ve Değiştirilmiş Alt Bileşenler ---

/**
 * Sol taraftaki YENİ Sera listesi
 */
function SeraNavigator({ seraNames, selectedSera, onSelectSera }) {
  return (
    <nav className="w-56 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-6 p-2">
        <Leaf className="text-green-500" size={28} />
        <h1 className="text-xl font-bold">IoT Sera Sistemi</h1>
      </div>
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Seralar</h2>
      <ul className="space-y-2">
        {seraNames.map(name => (
          <li key={name}>
            <button
              onClick={() => onSelectSera(name)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                ${selectedSera === name
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Building size={20} />
              <span className="font-medium">{name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Orta kolondaki YENİ Bitki/Cihaz listesi
 */
function DeviceSelector({ devices, selectedDeviceId, onSelectDevice }) {
  return (
    <nav className="w-64 bg-gray-50 dark:bg-gray-800/50 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
        Bitkiler / Cihazlar
      </h2>
      <ul className="space-y-2">
        {devices.map(device => (
          <li key={device.id}>
            <button
              onClick={() => onSelectDevice(device.id)}
              className={`w-full flex items-center justify-between gap-2 p-3 rounded-lg text-left transition-all
                ${selectedDeviceId === device.id
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
            >
              <span className="font-medium">{device.name.split(' - ')[1]}</span>
              {/* Cihaz durumunu gösteren küçük bir nokta */}
              <span className={`h-2.5 w-2.5 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}


/**
 * Seçilen cihazın tüm bilgilerini gösteren ana panel
 * (İçeriği değişmedi, sadece props'ları alıyor)
 */
function Dashboard({ device, onManualWater, onLightIntensityChange, onAutomationUpdate }) {
  const isOffline = device.status === 'offline';
  
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Başlık ve Durum */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold">{device.name}</h2>
        <div className="flex items-center gap-3">
          <span className={`relative flex h-3 w-3`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOffline ? 'bg-red-400' : 'bg-green-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
          </span>
          <span className="font-medium">{isOffline ? 'Çevrimdışı' : 'Çevrimiçi'}</span>
        </div>
      </div>
      
      {isOffline && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-100 flex items-center gap-3">
          <ZapOff />
          <span>Bu cihaz çevrimdışı. Veriler güncellenmiyor ve kontrol edilemiyor.</span>
        </div>
      )}

      {/* Ana Paneller (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        <StatusPanel sensors={device.sensors} disabled={isOffline} />
        
        <ControlPanel
          controls={device.controls}
          onManualWater={onManualWater}
          onLightIntensityChange={onLightIntensityChange}
          disabled={isOffline}
        />
        
        <AutomationPanel
          automation={device.automation}
          onUpdate={onAutomationUpdate}
          disabled={isOffline}
        />
        
        <div className="lg:col-span-3">
          <HistoryPanel
            sensorLog={device.history.sensorLog}
            wateringLog={device.history.wateringLog}
            disabled={isOffline}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Anlık Sıcaklık ve Nem Göstergesi
 */
function StatusPanel({ sensors, disabled }) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${disabled ? 'opacity-50' : ''}`}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CircleDot /> Anlık Sensör Verileri
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <Thermometer className="text-blue-500" size={32} />
          <span className="text-3xl font-bold mt-2">{sensors.temperature}°C</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Sıcaklık</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <Droplet className="text-green-500" size={32} />
          <span className="text-3xl font-bold mt-2">{sensors.humidity}%</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Toprak Nemi</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Manuel Kontrol Düğmeleri (Sulama, Işık Slider)
 */
function ControlPanel({ controls, onManualWater, onLightIntensityChange, disabled }) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Power /> Manuel Kontroller
      </h3>
      <div className="space-y-6"> 
        {/* Direkt Sulama Butonu */}
        <button
          onClick={onManualWater}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg font-medium transition-all hover:bg-blue-600 disabled:bg-gray-400"
        >
          <CloudDrizzle size={20} />
          Direkt Sula (150mL)
        </button>
        
        {/* Işık Ayarı SLIDER */}
        <div className="space-y-3">
          <label htmlFor="light-intensity" className="font-medium flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Sun size={20} className={controls.lightIntensity > 0 ? 'text-yellow-500' : 'text-gray-400'} />
              Yapay Işık Şiddeti
            </span>
            <span className="text-lg font-bold text-yellow-500">{controls.lightIntensity}%</span>
          </label>
          <input
            type="range"
            id="light-intensity"
            min="0"
            max="100"
            step="5"
            value={controls.lightIntensity}
            onChange={(e) => onLightIntensityChange(e.target.value)}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Otomasyon (Sulama Koşulları ve Işıklandırma Saatleri) Paneli
 * (Maksimum Sıcaklık kaldırıldı, Süre -> Miktar olarak değişti)
 */
function AutomationPanel({ automation, onUpdate, disabled }) {
  const [settings, setSettings] = useState(automation);
  
  useEffect(() => {
    setSettings(automation);
  }, [automation]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue;

    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'number') {
      finalValue = parseFloat(value);
      if (isNaN(finalValue)) finalValue = 0; // NaN kontrolü
    } else {
      finalValue = value; 
    }
    
    setSettings(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSave = () => {
    onUpdate(settings);
  };
  
  const hasChanged = JSON.stringify(automation) !== JSON.stringify(settings);

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Settings /> Otomasyon Ayarları
      </h3>
      <div className="space-y-4">
        {/* Etkinleştirme Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <label htmlFor="automation-enabled" className="font-medium">
            Otomasyon Etkin
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="automation-enabled"
              name="enabled"
              className="sr-only peer"
              checked={settings.enabled}
              onChange={handleChange}
              disabled={disabled}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-green-600"></div>
          </label>
        </div>
        
        {/* Koşul Ayarları (Form) */}
        <div className={`space-y-4 ${!settings.enabled ? 'opacity-50' : ''}`}>
          
          {/* Sulama Ayarları */}
          <fieldset className="border dark:border-gray-600 rounded-lg p-3 pt-0">
            <legend className="px-1 text-sm font-medium flex items-center gap-1"><Droplet size={14} /> Sulama</legend>
            <div className="space-y-3">
              <div>
                <label htmlFor="minHumidity" className="block text-sm font-medium mb-1">
                  Minimum Toprak Nemi (%)
                </label>
                <input
                  type="number"
                  id="minHumidity"
                  name="minHumidity"
                  value={settings.minHumidity || 0}
                  onChange={handleChange}
                  disabled={!settings.enabled || disabled}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Nem bu değerin altına düşerse sula.</p>
              </div>
              
              {/* Maksimum Sıcaklık AYARI KALDIRILDI */}
              
              <div>
                <label htmlFor="baseWaterAmount" className="block text-sm font-medium mb-1">
                  Temel Sulama Miktarı (mL)
                </label>
                <input
                  type="number"
                  id="baseWaterAmount"
                  name="baseWaterAmount"
                  value={settings.baseWaterAmount || 0}
                  onChange={handleChange}
                  disabled={!settings.enabled || disabled}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                 <p className="text-xs text-gray-500 mt-1">Sıcaklığa göre formül için temel miktar.</p>
              </div>
            </div>
          </fieldset>
          
          {/* Işıklandırma Ayarları */}
           <fieldset className="border dark:border-gray-600 rounded-lg p-3 pt-0">
            <legend className="px-1 text-sm font-medium flex items-center gap-1"><Clock size={14} /> Işıklandırma</legend>
            <div className="space-y-3">
              <p className="text-sm font-medium">Otomatik Işıklandırma Saatleri</p>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  id="lightStartTime"
                  name="lightStartTime"
                  value={settings.lightStartTime}
                  onChange={handleChange}
                  disabled={!settings.enabled || disabled}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="time"
                  id="lightEndTime"
                  name="lightEndTime"
                  value={settings.lightEndTime}
                  onChange={handleChange}
                  disabled={!settings.enabled || disabled}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </fieldset>
          
        </div>
        
        {/* Kaydet Butonu */}
        <button
          onClick={handleSave}
          disabled={!hasChanged || disabled}
          className="w-full p-3 bg-green-600 text-white rounded-lg font-medium transition-all hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {hasChanged ? 'Değişiklikleri Kaydet' : 'Kaydedildi'}
        </button>
      </div>
    </div>
  );
}

/**
 * Geçmiş Veri Tabloları (Sekmeli)
 */
function HistoryPanel({ sensorLog, wateringLog, disabled }) {
  const [activeTab, setActiveTab] = useState('sensors'); 
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <History /> Geçmiş Veriler
        </h3>
        {/* Sekme Butonları */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setActiveTab('sensors')}
            className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'sensors' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Sensör Geçmişi
          </button>
          <button
            onClick={() => setActiveTab('watering')}
            className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'watering' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Sulama Geçmişi
          </button>
        </div>
      </div>

      {/* Tablo Alanı */}
      <div className="max-h-64 overflow-y-auto">
        {activeTab === 'sensors' ? (
          <SensorHistoryTable log={sensorLog} />
        ) : (
          <WateringHistoryTable log={wateringLog} />
        )}
      </div>
    </div>
  );
}

function SensorHistoryTable({ log }) {
  if (log.length === 0) {
    return <p className="text-gray-500 text-center p-4">Sensör verisi bulunamadı.</p>;
  }
  return (
    <table className="w-full text-left table-auto">
      <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="p-3 text-sm font-semibold">Zaman Damgası</th>
          <th className="p-3 text-sm font-semibold">Sıcaklık</th>
          <th className="p-3 text-sm font-semibold">Toprak Nemi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {log.map((entry, index) => (
          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="p-3 text-sm">{entry.timestamp}</td>
            <td className="p-3 text-sm">{entry.temperature}°C</td>
            <td className="p-3 text-sm">{entry.humidity}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Sulama Geçmişi Tablosu (Süre -> Miktar olarak değişti)
 */
function WateringHistoryTable({ log }) {
  if (log.length === 0) {
    return <p className="text-gray-500 text-center p-4">Sulama kaydı bulunamadı.</p>;
  }
  return (
    <table className="w-full text-left table-auto">
      <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="p-3 text-sm font-semibold">Zaman Damgası</th>
          <th className="p-3 text-sm font-semibold">Eylem</th>
          <th className="p-3 text-sm font-semibold">Miktar</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {log.map((entry, index) => (
          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="p-3 text-sm">{entry.timestamp}</td>
            <td className="p-3 text-sm">
               <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                 entry.action === 'Manuel Sulama' 
                   ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                   : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
               }`}>
                {entry.action}
              </span>
            </td>
            <td className="p-3 text-sm">{entry.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}