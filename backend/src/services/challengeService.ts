import { Challenge, TestCase, FirebaseDatabaseService } from 'shared';

const CHALLENGES_COLLECTION = 'challenges';

export class ChallengeService {
  async getChallenge(id: string): Promise<Challenge | null> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getDocument<Challenge>(
        CHALLENGES_COLLECTION,
        id,
        (challenge) => resolve(challenge),
        (error) => {
          console.error('Error fetching challenge:', error);
          resolve(null);
        }
      );
    });
  }

  async getTestCases(challengeId: string): Promise<TestCase[]> {
    const challenge = await this.getChallenge(challengeId);
    return challenge?.tests || [];
  }

  async getChallengesByTopic(topic: string): Promise<Challenge[]> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.queryDocuments<Challenge>(
        CHALLENGES_COLLECTION,
        'topic',
        'title',
        topic,
        (challenges) => resolve(challenges),
        (error) => {
          console.error('Error fetching challenges by topic:', error);
          resolve([]);
        }
      );
    });
  }

  public async listTopics(): Promise<string[]> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.getAllDocuments<Challenge>(
        CHALLENGES_COLLECTION,
        (challenges) => {
          const topics = new Set(challenges.map(challenge => challenge.topic));
          resolve(Array.from(topics));
        },
        (error) => {
          console.error('Error fetching topics:', error);
          resolve([]);
        }
      );
    });
  }

  public async createChallenge(challenge: Omit<Challenge, 'id'>): Promise<Challenge> {
    const id = challenge.title.toLowerCase().replace(/\s+/g, '-');
    const newChallenge = { ...challenge, id };
    
    return new Promise((resolve, reject) => {
      FirebaseDatabaseService.updateDocument<Challenge>(
        CHALLENGES_COLLECTION,
        id,
        newChallenge,
        () => resolve(newChallenge),
        (error) => reject(error)
      );
    });
  }

  public async updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
    return new Promise((resolve) => {
      FirebaseDatabaseService.updateDocument<Challenge>(
        CHALLENGES_COLLECTION,
        id,
        updates,
        async () => {
          const updated = await this.getChallenge(id);
          resolve(updated);
        },
        (error) => {
          console.error('Error updating challenge:', error);
          resolve(null);
        }
      );
    });
  }

  public async bulkUploadChallenges(challenges: Challenge[]): Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as { id: string; error: string }[]
    };

    for (const challenge of challenges) {
      try {
        await FirebaseDatabaseService.updateDocument<Challenge>(
          CHALLENGES_COLLECTION,
          challenge.id,
          challenge,
          () => results.successful.push(challenge.id),
          (error) => results.failed.push({ 
            id: challenge.id, 
            error: error.message 
          })
        );
      } catch (error) {
        results.failed.push({ 
          id: challenge.id, 
          error: (error as Error).message 
        });
      }
    }

    return results;
  }
}

