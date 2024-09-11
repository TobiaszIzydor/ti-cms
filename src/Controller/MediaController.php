<?php
namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\MediaItem;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use App\Form\Type\MediaType;

class MediaController extends AbstractController
{
    
    #[Route('/api/tipanel_media/', name: 'tipanel_media')]
    public function index(Request $request, #[Autowire('%kernel.project_dir%/public/images/')] string $imageDirectory, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(MediaType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var UploadedFile $mediaFile */
            $mediaFiles = $form->get('image')->getData();

            if ($mediaFiles) {
                foreach ($mediaFiles as $mediaFile) {
                    $originalFilename = pathinfo($mediaFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $newFilename = $originalFilename.'.'.$mediaFile->guessExtension();
                    $newFilename = $originalFilename.'.'.$mediaFile->guessExtension();
                    $i = 1;
                    while (file_exists($imageDirectory.$newFilename)) {
                        $newFilename = $originalFilename.'-'.$i.'.'.$mediaFile->guessExtension();
                        $i++;
                    }
                    try {
                        $mimeType = $mediaFile->getMimeType();

                        if (strpos($mimeType, 'image/') === 0) {
                            $fileType = 'image';
                        } elseif (strpos($mimeType, 'video/') === 0) {
                            $fileType = 'video';
                        } elseif (strpos($mimeType, 'audio/') === 0) {
                            $fileType = 'audio';
                        } else {
                            $fileType = 'other';
                        }
                        $mediaFile->move(
                            $imageDirectory,
                            $newFilename
                        );
                    } catch (FileException $e) {
                        $this->addFlash('error', 'Wystąpił błąd podczas zapisywania pliku.');
                    }
                    $mediaItem = new MediaItem();
                    $mediaItem->setSource($newFilename);
                    $mediaItem->setType($fileType);
                    $entityManager->persist($mediaItem);
                    $entityManager->flush();
                    $this->addFlash('success', 'Plik został przesłany pomyślnie.');
                }
            }

            return $this->redirectToRoute('dashboard_path', ['name' => 'tipanel_media']);
        }

        $repository = $entityManager->getRepository(MediaItem::class);
        $media = $repository->findAllDesc();
        return $this->render('dashboard/media.html.twig', [
            'media' => $media,
            'form' => $form->createView(),
        ]);
    }
    #[Route('/api/tipanel_media_edit/', name: 'tipanel_media_edit')]
    public function edit(Request $request, EntityManagerInterface $entityManager): Response
    {
        $id = $request->query->get('id');
        $title = $request->query->get('title');
        $alt = $request->query->get('alt');
        $desc = $request->query->get('desc');

        if (!$id) {
            return new JsonResponse(['success' => false, 'message' => 'Nieprawidłowa treść.'], 400);
        }

        $media = $entityManager->getRepository(MediaItem::class)->find($id);

        if (!$media) {
            return new JsonResponse(['success' => false, 'message' => 'Nie znaleziono zdjęcia.'], 400);
        }
        $media->setAlt($alt);
        $media->setTitle($title);
        $media->setDescription($desc);

        $entityManager->persist($media);
        $entityManager->flush();
        
        return new JsonResponse(['success' => true]);
    }
    #[Route('/api/tipanel_media_delete/', name: 'tipanel_media_delete')]
    public function delete(Request $request, #[Autowire('%kernel.project_dir%/public/images/')] string $imageDirectory, EntityManagerInterface $entityManager): Response
    {
        $id = $request->query->get('id');

        if (!$id) {
            return new JsonResponse(['success' => false, 'message' => 'Nieprawidłowa treść.'], 400);
        }

        $media = $entityManager->getRepository(MediaItem::class)->find($id);

        if (!$media) {
            return new JsonResponse(['success' => false, 'message' => 'Nie znaleziono zdjęcia.'], 401);
        }
        $mediaPath = $imageDirectory.$media->getSource();
        
        $filesystem = new Filesystem();
        try {
            $filesystem->remove($mediaPath);
        } catch (IOExceptionInterface $exception) {
            return new JsonResponse(['success' => false, 'message' => 'Nie znaleziono zdjęcia.'], 402);
        }
            

        $entityManager->remove($media);
        $entityManager->flush();
        
        return new JsonResponse(['success' => true]);
    }
}