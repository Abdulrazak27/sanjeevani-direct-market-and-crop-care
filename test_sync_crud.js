// Comprehensive End-to-End Bidirectional CRUD Synchronization Test
const http = require("http");
const fs = require("fs");
const path = require("path");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING BIDIRECTIONAL SYNC CRUD VERIFICATION ===");
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // TEST 1: Health & Sync Heartbeat
  const health = await request({ hostname: "localhost", port: 3000, path: "/api/health", method: "GET" });
  assert(health.status === 200 && health.body.status === "healthy", "Backend Health Check (Single Source of Truth)");

  const syncState = await request({ hostname: "localhost", port: 3000, path: "/api/sync/state", method: "GET" });
  assert(syncState.status === 200 && syncState.body.version > 0, "Sync Heartbeat (/api/sync/state) returns active version timestamp");

  // TEST 2: Main Web -> Admin: Create Cold Storage Facility
  const testStorageId = `STR_TEST_${Date.now().toString().slice(-4)}`;
  const createStorageRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/cold-storage",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    id: testStorageId,
    facilityName: "Test Amaravathi Hyper Cold Chain",
    operatorName: "K. Nageswara Rao",
    phone: "+91 99887 76655",
    location: "Mangalagiri Bypass",
    district: "Guntur",
    totalCapacityMT: 4500,
    occupiedCapacityMT: 500,
    availableCapacityMT: 4000,
    dailyRateQtl: 9.5,
    temperatureC: 3.2,
    humidityPct: 87,
    supportedCrops: ["Tomato", "Chilli", "Turmeric"]
  });
  assert(createStorageRes.status === 200 && createStorageRes.body.id === testStorageId, "Main Web -> Admin: Create Cold Storage Listing");

  // Verify it appears in Cold Storage List
  const listStorage = await request({ hostname: "localhost", port: 3000, path: "/api/cold-storage", method: "GET" });
  const foundStorage = listStorage.body.find(s => s.id === testStorageId);
  assert(foundStorage && foundStorage.facility_name === "Test Amaravathi Hyper Cold Chain", "Admin Panel receives new Cold Storage Listing in real time");

  // TEST 3: Main Web -> Admin: Create Buyer
  const testBuyerId = `BUY_TEST_${Date.now().toString().slice(-4)}`;
  const createBuyerRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/buyers",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    id: testBuyerId,
    companyName: "Godavari Mega Food Park Traders",
    repName: "S. V. Murthy",
    phone: "+91 91234 56789",
    location: "Kakinada Port Hub",
    district: "East Godavari",
    buyerType: "Food Exporter",
    interestedCrops: ["Tomato", "Rice / Paddy"],
    priceOfferedQtl: 3200,
    minQtyTons: 20
  });
  assert(createBuyerRes.status === 200 && createBuyerRes.body.id === testBuyerId, "Main Web -> Admin: Create Buyer Listing");

  const listBuyers = await request({ hostname: "localhost", port: 3000, path: "/api/buyers", method: "GET" });
  const foundBuyer = listBuyers.body.find(b => b.id === testBuyerId);
  assert(foundBuyer && foundBuyer.company_name === "Godavari Mega Food Park Traders", "Admin Panel receives new Buyer Record in real time");

  // TEST 4: Main Web -> Admin: Add New Market Price Listing
  const testCropId = `CRP_TEST_${Date.now().toString().slice(-4)}`;
  const addPriceRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/crops",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    id: testCropId,
    name: "Onion (Bellary Red)",
    name_te: "ఉల్లిపాయ (బళ్లారి రెడ్)",
    name_hi: "प्याज",
    category: "Vegetables",
    variety: "Bellary",
    season: "Rabi",
    harvest_status: "Optimal Harvest",
    current_mandi_price: 2450.0,
    expected_price_qtl: 2450.0,
    mandi_name: "Kurnool Mandi Yard",
    unit: "₹/Quintal",
    change_pct: 4.2,
    trend: "up"
  });
  assert(addPriceRes.status === 200 && addPriceRes.body.id === testCropId, "Main Web -> Admin: Add New Market Price (Onion ₹2,450/Qtl)");

  const verifyCrops = await request({ hostname: "localhost", port: 3000, path: "/api/crops", method: "GET" });
  const foundCrop = verifyCrops.body.find(c => c.id === testCropId);
  assert(foundCrop && foundCrop.current_mandi_price === 2450.0, "Admin Panel receives new Market Price in Live Mandi Rate Controller");

  // TEST 5: Admin -> Main Web: Update Mandi Rate (Tomato CRP_01)
  const updateCropRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/crops/CRP_01",
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  }, {
    current_mandi_price: 3150.0,
    change_pct: 6.8,
    trend: "up"
  });
  assert(updateCropRes.status === 200 && updateCropRes.body.current_mandi_price === 3150.0, "Admin -> Main Web: Update Tomato Mandi Rate to ₹3150");

  const marketPrices = await request({ hostname: "localhost", port: 3000, path: "/api/market/prices", method: "GET" });
  const tomatoPrice = marketPrices.body.prices.find(p => p.id === "CRP_01");
  assert(tomatoPrice && tomatoPrice.price === 3150.0, "Main Web Live Mandi Ticker reflects updated rate ₹3150");

  // TEST 5: Admin -> Main Web: Approve Farmer KYC
  const approveKyc = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/farmers/FAR_203/status",
    method: "PATCH",
    headers: { "Content-Type": "application/json" }
  }, {
    kyc_status: "Verified",
    admin_name: "Master Admin"
  });
  assert(approveKyc.status === 200 && approveKyc.body.farmer.kyc_status === "Verified", "Admin -> Main Web: Approve Farmer FAR_203 KYC");

  // TEST 6: Cold Storage Space Booking (Farmer on Main Web books space)
  const bookingRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/cold-storage/book",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    facility_id: testStorageId,
    crop_name: "Tomato",
    farmer_name: "Ramesh Kumar",
    batch_size_mt: 50,
    expiry_date: "2026-10-21"
  });
  assert(bookingRes.status === 200 && bookingRes.body.facility.available_capacity_mt === 3950, "Cold Storage booking: 50 MT booked, available reduced to 3950 MT");

  // TEST 7: Admin -> Main Web: Delete Buyer
  const deleteBuyer = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/buyers/${testBuyerId}`,
    method: "DELETE"
  });
  assert(deleteBuyer.status === 200 && deleteBuyer.body.success, "Admin -> Main Web: Delete Buyer test record");

  const verifyDeletedBuyer = await request({ hostname: "localhost", port: 3000, path: "/api/buyers", method: "GET" });
  assert(!verifyDeletedBuyer.body.some(b => b.id === testBuyerId), "Deleted Buyer is completely removed from authoritative database");

  // TEST 8: Admin -> Main Web: Delete Cold Storage
  const deleteStorage = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/cold-storage/${testStorageId}`,
    method: "DELETE"
  });
  assert(deleteStorage.status === 200 && deleteStorage.body.success, "Admin -> Main Web: Delete Cold Storage test record");

  // TEST 9: Persistent Disk Storage Verification
  const dbFile = path.join(__dirname, "database", "sanjeevani_db.json");
  assert(fs.existsSync(dbFile), "sanjeevani_db.json file exists on disk");
  const rawDb = JSON.parse(fs.readFileSync(dbFile, "utf8"));
  assert(rawDb.crops.find(c => c.id === "CRP_01").current_mandi_price === 3150.0, "Database file contains persisted Tomato rate ₹3150 across restarts");

  console.log(`\n=== RESULTS: ${passed}/${total} TESTS PASSED ===`);
  if (passed === total) {
    console.log("🎉 ALL BIDIRECTIONAL CRUD SYNCHRONIZATION TESTS PASSED PERFECTLY!");
  } else {
    console.error("⚠️ SOME TESTS FAILED.");
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
