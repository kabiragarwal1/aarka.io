from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Iterable, List
from uuid import uuid4

from .compliance import ComplianceGuard, ComplianceResult
from .models import (
    AnalyticsPoint,
    Channel,
    ChannelType,
    ComplianceSettings,
    ContentAsset,
    OptimizationSuggestion,
    PublicationPlan,
    PublicationRecord,
    Region,
    Translation,
)


@dataclass(slots=True)
class MediaManagementPlatform:
    channels: Dict[str, Channel]
    compliance_settings: ComplianceSettings
    assets: Dict[str, ContentAsset] = field(default_factory=dict)
    translations: Dict[str, List[Translation]] = field(default_factory=dict)
    publications: List[PublicationRecord] = field(default_factory=list)
    analytics: Dict[str, AnalyticsPoint] = field(default_factory=dict)
    _guard: ComplianceGuard = field(init=False, repr=False)

    def __post_init__(self) -> None:
        self._guard = ComplianceGuard(self.compliance_settings)

    def create_asset(self, title: str, body: str, language: str, tags: Iterable[str] | None = None) -> ContentAsset:
        asset = ContentAsset(
            id=str(uuid4()),
            title=title,
            body=body,
            language=language,
            tags=list(tags or []),
        )
        self.assets[asset.id] = asset
        return asset

    def translate_asset(self, asset_id: str, target_language: str) -> Translation:
        source = self.assets[asset_id]
        # Placeholder translation strategy for MVP scaffolding
        localized_title = f"[{target_language}] {source.title}"
        localized_body = f"[{target_language}] {source.body}"
        translation = Translation(asset_id, target_language, localized_title, localized_body)
        self.translations.setdefault(asset_id, []).append(translation)
        return translation

    def validate_asset(self, asset_id: str) -> ComplianceResult:
        return self._guard.review(self.assets[asset_id])

    def publish(self, plan: PublicationPlan, language: str) -> List[PublicationRecord]:
        validation = self.validate_asset(plan.asset_id)
        if not validation.approved:
            raise ValueError(f"Compliance rejection: {validation.blocked_reasons}")

        now = plan.scheduled_for or datetime.utcnow()
        published: List[PublicationRecord] = []
        for channel_id in plan.target_channels:
            for region in plan.target_regions:
                record = PublicationRecord(
                    plan_id=str(uuid4()),
                    asset_id=plan.asset_id,
                    channel_id=channel_id,
                    region=region,
                    language=language,
                    published_at=now,
                    status="published",
                    advisory_notes=validation.warnings.copy(),
                )
                self.publications.append(record)
                published.append(record)
        return published

    def ingest_analytics(self, publication_id: str, impressions: int, clicks: int, conversions: int, spend_usd: float) -> AnalyticsPoint:
        point = AnalyticsPoint(publication_id, impressions, clicks, conversions, spend_usd)
        self.analytics[publication_id] = point
        return point

    def suggest_optimizations(self, publication_id: str, auto_manage: bool = True) -> List[OptimizationSuggestion]:
        point = self.analytics[publication_id]
        suggestions: List[OptimizationSuggestion] = []
        if point.ctr < 0.01:
            suggestions.append(
                OptimizationSuggestion(
                    publication_id,
                    "Refresh hooks/thumbnail and expand lookalike audiences.",
                    "Lift CTR by 20-40%",
                )
            )
        if point.conversion_rate < 0.02:
            suggestions.append(
                OptimizationSuggestion(
                    publication_id,
                    "Route budget to high-intent placements and localized CTA copy.",
                    "Improve conversion rate by 10-25%",
                )
            )
        if point.spend_usd > 0 and point.conversions == 0:
            suggestions.append(
                OptimizationSuggestion(
                    publication_id,
                    "Pause underperforming segment and trigger creative A/B test.",
                    "Reduce wasted spend immediately",
                )
            )

        if auto_manage and suggestions:
            for suggestion in suggestions:
                suggestion.recommendation = f"[AUTO-APPLIED] {suggestion.recommendation}"

        return suggestions


def default_platform() -> MediaManagementPlatform:
    channels = {
        "instagram": Channel("instagram", "Instagram", type=ChannelType.SOCIAL),
        "youtube_ott": Channel("youtube_ott", "YouTube Connected TV", type=ChannelType.OTT),
        "programmatic_display": Channel("programmatic_display", "Programmatic Display", type=ChannelType.DISPLAY),
        "ai_network": Channel("ai_network", "AI Placement Network", type=ChannelType.AI_PLACEMENT),
    }
    return MediaManagementPlatform(channels=channels, compliance_settings=ComplianceSettings())


WORLDWIDE_REGIONS = [Region.US, Region.EU, Region.APAC, Region.LATAM, Region.MEA]
