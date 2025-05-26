import { NextApiRequest, NextApiResponse } from 'next';
import { getAllGiftCards } from '../../../../lib/database';
import { validateAdminSession } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate admin session
  const isAdmin = await validateAdminSession(req);
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { page = '1', status = 'all', search = '' } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;
      const limit = 10;
      const offset = (pageNumber - 1) * limit;

      // Get all gift cards from database
      const allGiftCards = await getAllGiftCards();
      
      // Apply filters
      let filteredGiftCards = allGiftCards;
      
      // Filter by status if not 'all'
      if (status !== 'all') {
        filteredGiftCards = filteredGiftCards.filter(card => card.status === status);
      }
      
      // Filter by search term if provided
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredGiftCards = filteredGiftCards.filter(card => 
          card.code.toLowerCase().includes(searchTerm) ||
          (card.recipient_email && card.recipient_email.toLowerCase().includes(searchTerm)) ||
          (card.recipient_name && card.recipient_name.toLowerCase().includes(searchTerm)) ||
          (card.sender_email && card.sender_email.toLowerCase().includes(searchTerm)) ||
          (card.sender_name && card.sender_name.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply pagination
      const totalCount = filteredGiftCards.length;
      const totalPages = Math.ceil(totalCount / limit);
      const paginatedGiftCards = filteredGiftCards.slice(offset, offset + limit);

      return res.status(200).json({
        giftCards: paginatedGiftCards,
        totalCount,
        totalPages,
        currentPage: pageNumber
      });
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      return res.status(500).json({ error: 'Failed to fetch gift cards' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
