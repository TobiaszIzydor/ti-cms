<?php
namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\UX\Dropzone\Form\DropzoneType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;

class MediaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('image', DropzoneType::class, [
                'attr' => [
                    'multiple' => true,
                    'placeholder' => 'Drag and drop a file or click to browse',
                ],
                'label' => 'Media upload',
                'multiple' => true,
            ]);
    }
}