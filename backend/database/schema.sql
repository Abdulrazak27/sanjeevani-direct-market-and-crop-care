-- Sanjeevani Supabase PostgreSQL Schema
-- Smart Crop Care & Direct Market Access Platform

CREATE TABLE IF NOT EXISTS languages (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO languages (id, name, native_name) VALUES 
('te', 'Telugu', '??????'),
('hi', 'Hindi', '??????'),
('en', 'English', 'English')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    profile_photo_url TEXT,
    village VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    main_crop VARCHAR(100),
    farm_size_acres DECIMAL(5,2),
    language VARCHAR(10) DEFAULT 'te' REFERENCES languages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en VARCHAR(100) NOT NULL,
    name_te VARCHAR(100),
    name_hi VARCHAR(100),
    category VARCHAR(50),
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name VARCHAR(100) NOT NULL,
    disease_name_en VARCHAR(100) NOT NULL,
    disease_name_te VARCHAR(100),
    disease_name_hi VARCHAR(100),
    severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'severe')),
    explanation_te TEXT,
    explanation_hi TEXT,
    explanation_en TEXT,
    treatment_steps_te JSONB,
    treatment_steps_hi JSONB,
    treatment_steps_en JSONB,
    preventive_measures JSONB
);

CREATE TABLE IF NOT EXISTS ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    dataset_name VARCHAR(100) NOT NULL DEFAULT 'WPF Plant Dataset',
    supported_classes JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'deployed',
    trained_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_diagnosis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmer_profiles(id),
    image_url TEXT,
    detected_crop VARCHAR(100) NOT NULL,
    detected_disease VARCHAR(100),
    confidence DECIMAL(5,4) NOT NULL,
    severity VARCHAR(20),
    model_version VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weather_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(50) NOT NULL,
    title_te VARCHAR(200),
    title_hi VARCHAR(200),
    title_en VARCHAR(200),
    message_te TEXT,
    message_hi TEXT,
    message_en TEXT,
    valid_until TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name VARCHAR(100) NOT NULL,
    mandi_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    price_per_quintal DECIMAL(10,2) NOT NULL,
    price_change_pct DECIMAL(5,2) DEFAULT 0.0,
    is_live BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    buyer_type VARCHAR(50) CHECK (buyer_type IN ('Trader', 'Exporter', 'Processor', 'Retailer', 'FPO')),
    crop_required VARCHAR(100) NOT NULL,
    min_quantity_tons DECIMAL(8,2),
    location VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS fpos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    supported_crops JSONB NOT NULL,
    member_count INT DEFAULT 0,
    contact_phone VARCHAR(15) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS cold_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    distance_km DECIMAL(6,2),
    capacity_mt DECIMAL(10,2),
    available_space_mt DECIMAL(10,2),
    contact_phone VARCHAR(15) NOT NULL,
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS transporters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_type VARCHAR(50) NOT NULL,
    capacity_tons DECIMAL(6,2) NOT NULL,
    rate_per_km DECIMAL(8,2) NOT NULL,
    contact_phone VARCHAR(15) NOT NULL,
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS produce_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmer_profiles(id),
    crop_name VARCHAR(100) NOT NULL,
    quantity_quintals DECIMAL(8,2) NOT NULL,
    expected_price_per_quintal DECIMAL(10,2) NOT NULL,
    harvest_date DATE NOT NULL,
    location VARCHAR(150) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS work_coordinator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coordinator_name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    available_workers INT DEFAULT 0,
    overall_status VARCHAR(20) CHECK (overall_status IN ('Available', 'Limited', 'Unavailable')),
    work_types_status JSONB NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    is_demo BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmer_profiles(id),
    work_type VARCHAR(50) NOT NULL,
    request_date DATE NOT NULL,
    workers_needed INT NOT NULL,
    location VARCHAR(150) NOT NULL,
    instructions TEXT,
    status VARCHAR(20) DEFAULT 'Requested' CHECK (status IN ('Requested', 'Waiting for Coordinator', 'Confirmed', 'Unavailable', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmer_profiles(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    target_screen VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
