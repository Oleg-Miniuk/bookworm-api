import express from 'express';

const router = express.Router();

router.get('/search', (req, res) => {
  res.json({
    books: [
      {
        bookId: 1,
        title: '1984',
        authors: 'Orwell',
        covers: ['imgUrl1', 'imgUrl2'],
        pages: 198
      },
      {
        bookId: 2,
        title: 'The Financier',
        authors: 'Dreiser',
        covers: ['imgUrl1', 'imgUrl2'],
        pages: 250
      }
    ]
  });
});

export default router;
