import { BskyAgent } from '@atproto/api';
import { sendPostWithImages } from '../src/postWithImages';
import fs from 'fs/promises';

class MockBskyAgent {
  async login() {}

  async uploadBlob() {
    return { data: { blob: 'mockBlobUri' } };
  }

  async post(data) {
    return data;
  }
}

describe('sendPostWithImages', () => {
  it('should create a post with images', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from('mockImageData'));

    const agent = new MockBskyAgent() as unknown as BskyAgent;

    const imagePaths = ['image1.jpg', 'image2.png'];
    const text = 'Test Post';

    // Call the function
    const result = await sendPostWithImages(agent, imagePaths, text);

    // Assertions
    expect(result).toHaveProperty('text', text);
    expect(result.embed.images).toHaveLength(imagePaths.length);
    expect(result.embed.images[0]).toHaveProperty('image', 'mockBlobUri');

    // Restore original functionality
    jest.restoreAllMocks();
  });
});
