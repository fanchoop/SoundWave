const musiqueDAO = require('../MusiqueDAO');
var dummyData = {
    "idPlage": 9999,
    "titre": "Belle",
    "duree": 40000,
    "nbLike": 5,
    "nbCommentaire": 80,
    "nbEcoute": 1000,
    "cheminFichierJSON": "/home/toto/fichier.json",
    "idAuteur": 1,
    "nomAuteur": "Jean",
    "anneePlage": 2018,
    "cheminPochette": "/home/toto/pochette.jpg",
    "cheminMP3": "/home/toto/toto.mp3"
};

var dummyData2 = {
    "idPlage": 9998,
    "titre": "Belle",
    "duree": 40000,
    "nbLike": 5,
    "nbCommentaire": 80,
    "nbEcoute": 1000,
    "cheminFichierJSON": "/home/toto/fichier.json",
    "idAuteur": 1,
    "nomAuteur": "Jean",
    "anneePlage": 2018,
    "cheminPochette": "/home/toto/pochette.jpg",
    "cheminMP3": "/home/toto/toto.mp3"
};

test('test insertOne in mongodb', () => {
    musiqueDAO.insertOne(dummyData, (error) => {
        expect(error).toBe(null);
        musiqueDAO.deleteOne({"idPlage": 9999}, () => {});
    });
});

test('test updateOne in mongodb', () => {
    musiqueDAO.insertOne(dummyData, () => {
        musiqueDAO.updateOne({"idPlage": 9999}, {$set: dummyData2}, (error) => {
            expect(error).toBe(null);
            musiqueDAO.deleteOne({"idPlage": 9998}, () => {});
        });
    });
});

test('test deleteOne in mongodb', () => {
    musiqueDAO.insertOne(dummyData, () => {
        musiqueDAO.deleteOne({"idPlage": 9999}, (error) => {
            expect(error).toBe(null);
        });
    });
});

test('test findAll in mongodb', () => {
    musiqueDAO.findAll(() => {
        expect(error).toBe(null);
    });
});

test('test findByOption in mongodb', () => {
    musiqueDAO.findByOption({"titre": "Belle"}, () => {
        expect(error).toBe(null);
    });
});

test('test findLastEntry in mongodb', () => {
    musiqueDAO.findLastEntry(() => {
        expect(error).toBe(null);
    });
});

test('test findByTitre in mongodb', () => {
    musiqueDAO.findByTitre({"titre": "Belle"}, () => {
        expect(error).toBe(null);
    });
});
