import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc,
  deleteDoc
} from "firebase/firestore/lite";
import { Campaign, GalleryAsset, SupportTicket, FaqArticle, FeedbackMessage } from "./types";
import { Project } from "./types/Project";
import { INITIAL_CAMPAIGNS, INITIAL_PROJECTS } from "./data";

const firebaseConfig = {
  projectId: "makhdumashrfsimnanieducain",
  appId: "1:1089861089984:web:b1fc5fe85e8348395b8b25",
  apiKey: "AIzaSyD9SLR6pumr3yAcKMTvYIFmhIIUufCxWfY",
  authDomain: "makhdumashrfsimnanieducain.firebaseapp.com",
  storageBucket: "makhdumashrfsimnanieducain.firebasestorage.app",
  messagingSenderId: "1089861089984"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore specifying our unique databaseId
export const db = initializeFirestore(app, {}, "ai-studio-brickmakerstudio-1b05e504-4f97-472f-b26f-c2f7f43c1396");

const CAMPAIGNS_COLLECTION = "campaigns";

/**
 * Fetches all campaigns from the Firestore cloud database.
 * If the collection is empty, populates it with the default INITIAL_CAMPAIGNS.
 */
export async function getCampaignsFromDb(): Promise<Campaign[]> {
  try {
    const querySnapshot = await getDocs(collection(db, CAMPAIGNS_COLLECTION));
    const campaigns: Campaign[] = [];
    
    querySnapshot.forEach((document) => {
      campaigns.push(document.data() as Campaign);
    });

    if (campaigns.length === 0) {
      console.log("Firestore campaigns collection is empty. Seeding initial templates...");
      // Seed default campaigns in parallel
      await Promise.all(
        INITIAL_CAMPAIGNS.map(async (camp) => {
          await setDoc(doc(db, CAMPAIGNS_COLLECTION, camp.id), camp);
        })
      );
      return INITIAL_CAMPAIGNS;
    }

    // Sort by createdAt descending
    return campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error("Error reading campaigns from Firestore:", err);
    // Fallback to local data if there is an issue (offline/permissions etc.)
    return INITIAL_CAMPAIGNS;
  }
}

/**
 * Saves a single campaign to Firestore. Overwrites if ID already exists.
 */
export async function saveCampaignToDb(campaign: Campaign): Promise<void> {
  try {
    await setDoc(doc(db, CAMPAIGNS_COLLECTION, campaign.id), campaign);
    console.log(`Saved campaign ${campaign.id} to cloud database.`);
  } catch (err) {
    console.error(`Error saving campaign ${campaign.id} to Firestore:`, err);
    throw err;
  }
}

/**
 * Updates a single campaign status in Firestore.
 */
export async function updateCampaignStatusInDb(id: string, status: "Active" | "Paused" | "Completed" | "Draft"): Promise<void> {
  try {
    const campaignRef = doc(db, CAMPAIGNS_COLLECTION, id);
    await updateDoc(campaignRef, { status });
    console.log(`Updated campaign ${id} status to ${status} in cloud database.`);
  } catch (err) {
    console.error(`Error updating campaign ${id} status:`, err);
    throw err;
  }
}

const PROJECTS_COLLECTION = "projects";

/**
 * Fetches all projects from the Firestore cloud database.
 * If the collection is empty, populates it with the default INITIAL_PROJECTS.
 */
export async function getProjectsFromDb(): Promise<Project[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    const projects: Project[] = [];
    
    querySnapshot.forEach((document) => {
      projects.push(document.data() as Project);
    });

    if (projects.length === 0) {
      console.log("Firestore projects collection is empty. Seeding initial projects...");
      // Seed default projects in parallel
      await Promise.all(
        INITIAL_PROJECTS.map(async (proj) => {
          await setDoc(doc(db, PROJECTS_COLLECTION, proj.id), proj);
        })
      );
      return INITIAL_PROJECTS;
    }

    // Sort by createdAt descending
    return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error("Error reading projects from Firestore:", err);
    // Fallback to local data
    return INITIAL_PROJECTS;
  }
}

/**
 * Saves a single project to Firestore. Overwrites if ID already exists.
 */
export async function saveProjectToDb(project: Project): Promise<void> {
  try {
    await setDoc(doc(db, PROJECTS_COLLECTION, project.id), project);
    console.log(`Saved project ${project.id} to cloud database.`);
  } catch (err) {
    console.error(`Error saving project ${project.id} to Firestore:`, err);
    throw err;
  }
}

/**
 * Updates properties of a project in Firestore.
 */
export async function updateProjectInDb(id: string, updates: Partial<Project>): Promise<void> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    await updateDoc(projectRef, updates);
    console.log(`Updated project ${id} properties in cloud database.`);
  } catch (err) {
    console.error(`Error updating project ${id}:`, err);
    throw err;
  }
}

/**
 * Deletes a project from Firestore.
 */
export async function deleteProjectFromDb(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    console.log(`Deleted project ${id} from cloud database.`);
  } catch (err) {
    console.error(`Error deleting project ${id}:`, err);
    throw err;
  }
}

const GALLERY_COLLECTION = "gallery_assets";

/**
 * Fetches all user-uploaded and custom gallery assets from Firestore.
 */
export async function getGalleryAssetsFromDb(): Promise<GalleryAsset[]> {
  try {
    const querySnapshot = await getDocs(collection(db, GALLERY_COLLECTION));
    const assets: GalleryAsset[] = [];
    querySnapshot.forEach((document) => {
      assets.push(document.data() as GalleryAsset);
    });
    // Sort by createdAt descending
    return assets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error("Error reading gallery assets from Firestore:", err);
    return [];
  }
}

/**
 * Saves a gallery asset to Firestore. Overwrites if ID already exists.
 */
export async function saveGalleryAssetToDb(asset: GalleryAsset): Promise<void> {
  try {
    await setDoc(doc(db, GALLERY_COLLECTION, asset.id), asset);
    console.log(`Saved gallery asset ${asset.id} to cloud database.`);
  } catch (err) {
    console.error(`Error saving gallery asset ${asset.id} to Firestore:`, err);
    throw err;
  }
}

/**
 * Deletes a gallery asset from Firestore.
 */
export async function deleteGalleryAssetFromDb(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, GALLERY_COLLECTION, id));
    console.log(`Deleted gallery asset ${id} from cloud database.`);
  } catch (err) {
    console.error(`Error deleting gallery asset ${id} from Firestore:`, err);
    throw err;
  }
}

// ─── SUPPORT SYSTEM PERSISTENCE ──────────────────────────────────────────

const SUPPORT_COLLECTION = "support_tickets";
const FAQ_COLLECTION = "faqs";
const FEEDBACK_COLLECTION = "feedback";

// Default FAQ content to seed if empty
const INITIAL_FAQS: FaqArticle[] = [
  {
    id: "faq_1",
    question: "What is Brick-Maker Studio?",
    answer: "Brick-Maker Studio is an all-in-one elite creative workspace offering marketing content creation, video rendering, flyer design, and direct branding solutions for premium masonry, construction, and architectural businesses.",
    category: "Getting Started"
  },
  {
    id: "faq_2",
    question: "How do I start a video generation job?",
    answer: "Navigate to the Video tab. Enter a description of your scene, select the resolution (480P is recommended for maximum stability and speed with Wan2.1 T2V 1.3B), and click 'Generate'. The system will compile the rendering task.",
    category: "Video Production"
  },
  {
    id: "faq_3",
    question: "How do I upgrade to Premium?",
    answer: "Go to the Premium section from the navigation bar. Select your enterprise scaling package, complete the checkout form, and instant gold-tier credits will be credited to your account.",
    category: "Premium Membership"
  },
  {
    id: "faq_4",
    question: "Can I manage campaigns and budgets?",
    answer: "Yes, the Growth and Dashboard sections allow you to create, manage, pause, and analyze real-time search, print, and social media campaigns.",
    category: "Business Growth Center"
  }
];

/**
 * Fetches all support tickets from the database.
 */
export async function getSupportTicketsFromDb(): Promise<SupportTicket[]> {
  try {
    const querySnapshot = await getDocs(collection(db, SUPPORT_COLLECTION));
    const tickets: SupportTicket[] = [];
    querySnapshot.forEach((document) => {
      tickets.push(document.data() as SupportTicket);
    });
    return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error("Error reading support tickets from Firestore:", err);
    return [];
  }
}

/**
 * Saves or updates a support ticket.
 */
export async function saveSupportTicketToDb(ticket: SupportTicket): Promise<void> {
  try {
    await setDoc(doc(db, SUPPORT_COLLECTION, ticket.id), ticket);
    console.log(`Saved support ticket ${ticket.id} to cloud database.`);
  } catch (err) {
    console.error(`Error saving support ticket ${ticket.id}:`, err);
    throw err;
  }
}

/**
 * Updates properties on a support ticket.
 */
export async function updateSupportTicketInDb(id: string, updates: Partial<SupportTicket>): Promise<void> {
  try {
    const ticketRef = doc(db, SUPPORT_COLLECTION, id);
    await updateDoc(ticketRef, updates);
    console.log(`Updated support ticket ${id} in cloud database.`);
  } catch (err) {
    console.error(`Error updating support ticket ${id}:`, err);
    throw err;
  }
}

/**
 * Deletes a support ticket.
 */
export async function deleteSupportTicketFromDb(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SUPPORT_COLLECTION, id));
    console.log(`Deleted support ticket ${id} from cloud database.`);
  } catch (err) {
    console.error(`Error deleting support ticket ${id}:`, err);
    throw err;
  }
}

/**
 * Fetches all FAQ articles. Seeds initial FAQs if empty.
 */
export async function getFaqsFromDb(): Promise<FaqArticle[]> {
  try {
    const querySnapshot = await getDocs(collection(db, FAQ_COLLECTION));
    const faqs: FaqArticle[] = [];
    querySnapshot.forEach((document) => {
      faqs.push(document.data() as FaqArticle);
    });

    if (faqs.length === 0) {
      console.log("Seeding initial FAQs...");
      await Promise.all(
        INITIAL_FAQS.map(async (faq) => {
          await setDoc(doc(db, FAQ_COLLECTION, faq.id), faq);
        })
      );
      return INITIAL_FAQS;
    }
    return faqs;
  } catch (err) {
    console.error("Error reading FAQs from Firestore:", err);
    return INITIAL_FAQS;
  }
}

/**
 * Saves an FAQ article.
 */
export async function saveFaqToDb(faq: FaqArticle): Promise<void> {
  try {
    await setDoc(doc(db, FAQ_COLLECTION, faq.id), faq);
    console.log(`Saved FAQ ${faq.id} to cloud database.`);
  } catch (err) {
    console.error(`Error saving FAQ ${faq.id}:`, err);
    throw err;
  }
}

/**
 * Deletes an FAQ article.
 */
export async function deleteFaqFromDb(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, FAQ_COLLECTION, id));
    console.log(`Deleted FAQ ${id} from cloud database.`);
  } catch (err) {
    console.error(`Error deleting FAQ ${id}:`, err);
    throw err;
  }
}

/**
 * Fetches all feedback messages.
 */
export async function getFeedbackFromDb(): Promise<FeedbackMessage[]> {
  try {
    const querySnapshot = await getDocs(collection(db, FEEDBACK_COLLECTION));
    const feedbackList: FeedbackMessage[] = [];
    querySnapshot.forEach((document) => {
      feedbackList.push(document.data() as FeedbackMessage);
    });
    return feedbackList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error("Error reading feedback from Firestore:", err);
    return [];
  }
}

/**
 * Saves a feedback message.
 */
export async function saveFeedbackToDb(feedback: FeedbackMessage): Promise<void> {
  try {
    await setDoc(doc(db, FEEDBACK_COLLECTION, feedback.id), feedback);
    console.log(`Saved feedback message ${feedback.id} to cloud database.`);
  } catch (err) {
    console.error(`Error saving feedback:`, err);
    throw err;
  }
}
