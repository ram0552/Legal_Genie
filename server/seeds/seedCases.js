import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/legalgenie';
const dbName = 'legalgenie';

const cases = [
    {
        caseId: "CASE_101",
        caseName: "State of X vs Rahul Sharma",
        year: 2018,
        court: "Supreme Court of India",
        jurisdiction: "Criminal",
        judgmentText: "Accused charged under Section 302 IPC. Prosecution relied on circumstantial evidence. Defense highlighted procedural lapses.",
        extractedActs: ["Section 302 of IPC", "Article 21 of Constitution of India"],
        aiBrief: {
            facts: "The accused was alleged to have committed murder based on circumstantial evidence.",
            issues: "Whether circumstantial evidence was sufficient for conviction.",
            verdict: "The accused was acquitted.",
            reasoning: "The evidence did not establish guilt beyond reasonable doubt."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_102",
        caseName: "Meera Devi vs Municipal Corporation",
        year: 2020,
        court: "Delhi High Court",
        jurisdiction: "Civil",
        judgmentText: "Petitioner suffered injuries due to potholes. Municipal authority argued contributory negligence.",
        extractedActs: ["Article 14 of Constitution of India", "Motor Vehicles Act, 1988"],
        aiBrief: {
            facts: "Injuries caused by poor road maintenance.",
            issues: "Liability of municipal authority for negligence.",
            verdict: "Compensation awarded.",
            reasoning: "Failure to maintain roads amounted to breach of duty of care."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_103",
        caseName: "Rohit Verma vs Union of India",
        year: 2015,
        court: "Supreme Court of India",
        jurisdiction: "Constitutional",
        judgmentText: "Challenge to government notification on grounds of arbitrariness.",
        extractedActs: ["Article 14 of Constitution of India", "Article 19 of Constitution of India"],
        aiBrief: {
            facts: "Policy challenged as arbitrary.",
            issues: "Violation of fundamental rights.",
            verdict: "Notification struck down.",
            reasoning: "Policy was discriminatory and lacked reasonable classification."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_104",
        caseName: "Anita Singh vs State of Y",
        year: 2019,
        court: "Bombay High Court",
        jurisdiction: "Criminal",
        judgmentText: "Bail application filed in a narcotics case citing prolonged custody.",
        extractedActs: ["NDPS Act, 1985", "Article 21 of Constitution of India"],
        aiBrief: {
            facts: "Accused sought bail after extended incarceration.",
            issues: "Whether prolonged custody justified bail.",
            verdict: "Bail granted.",
            reasoning: "Right to personal liberty outweighed prosecution objections."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_105",
        caseName: "Arjun Mehta vs ABC Pvt Ltd",
        year: 2021,
        court: "National Consumer Disputes Redressal Commission",
        jurisdiction: "Consumer",
        judgmentText: "Defective product supplied causing financial loss.",
        extractedActs: ["Consumer Protection Act, 2019"],
        aiBrief: {
            facts: "Consumer purchased defective goods.",
            issues: "Deficiency in service.",
            verdict: "Refund and compensation ordered.",
            reasoning: "Seller failed to meet statutory obligations."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_106",
        caseName: "Kavita Rao vs State Transport Authority",
        year: 2017,
        court: "Madras High Court",
        jurisdiction: "Administrative",
        judgmentText: "Permit cancellation challenged as arbitrary.",
        extractedActs: ["Motor Vehicles Act, 1988", "Article 14 of Constitution of India"],
        aiBrief: {
            facts: "Transport permit cancelled without hearing.",
            issues: "Violation of principles of natural justice.",
            verdict: "Cancellation quashed.",
            reasoning: "No opportunity of hearing was provided."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_107",
        caseName: "Sunil Kumar vs State of Z",
        year: 2016,
        court: "Punjab & Haryana High Court",
        jurisdiction: "Criminal",
        judgmentText: "Conviction challenged due to hostile witnesses.",
        extractedActs: ["Section 376 of IPC"],
        aiBrief: {
            facts: "Key witnesses turned hostile.",
            issues: "Reliability of prosecution case.",
            verdict: "Conviction set aside.",
            reasoning: "Evidence was inconsistent and unreliable."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_108",
        caseName: "Green Earth Foundation vs Union of India",
        year: 2022,
        court: "Supreme Court of India",
        jurisdiction: "Environmental",
        judgmentText: "Environmental clearance challenged for industrial project.",
        extractedActs: ["Environment Protection Act, 1986", "Article 48A of Constitution of India"],
        aiBrief: {
            facts: "NGO challenged environmental approval.",
            issues: "Compliance with environmental safeguards.",
            verdict: "Clearance suspended.",
            reasoning: "Mandatory impact assessment was not conducted."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_109",
        caseName: "Ramesh Patel vs Income Tax Department",
        year: 2014,
        court: "Gujarat High Court",
        jurisdiction: "Tax",
        judgmentText: "Reassessment notice issued without valid reasons.",
        extractedActs: ["Income Tax Act, 1961"],
        aiBrief: {
            facts: "Tax reassessment challenged.",
            issues: "Legality of reassessment proceedings.",
            verdict: "Notice quashed.",
            reasoning: "Lack of tangible material to reopen assessment."
        },
        createdAt: new Date()
    },
    {
        caseId: "CASE_110",
        caseName: "Neha Kapoor vs XYZ Tech Ltd",
        year: 2023,
        court: "Karnataka High Court",
        jurisdiction: "Employment",
        judgmentText: "Termination challenged as arbitrary and without due process.",
        extractedActs: ["Industrial Disputes Act, 1947", "Article 21 of Constitution of India"],
        aiBrief: {
            facts: "Employee terminated without inquiry.",
            issues: "Legality of termination.",
            verdict: "Termination set aside.",
            reasoning: "Violation of principles of natural justice."
        },
        createdAt: new Date()
    }
];

const seedDB = async () => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB for seeding...');

        const db = client.db(dbName);
        const collection = db.collection('cases');

        await collection.deleteMany({});
        console.log('Cleared existing cases.');

        const result = await collection.insertMany(cases);
        console.log(`${result.insertedCount} legal cases added successfully.`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
        console.log('Database connection closed.');
        process.exit();
    }
};

seedDB();